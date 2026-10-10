import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { gaussian, mulberry32 } from '../lib/random'

interface ClusterPoint {
  x: number
  y: number
}

interface KMeansState {
  points: ClusterPoint[]
  centers: ClusterPoint[]
  assignments: number[]
  step: number
  converged: boolean
}

const W = 640
const H = 400
const PAD = 30

// 6 种簇颜色(蓝、紫、粉、青、绿、橙),与站点蓝紫主题保持协调。
const PALETTE = ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']

// 数据由 3 个自然的"高斯团"生成,便于观察聚类效果。
const NATURAL_CENTERS: ClusterPoint[] = [
  { x: 2.5, y: 3 },
  { x: 7, y: 2.5 },
  { x: 5, y: 7.5 },
]

function makePoints(seed: number): ClusterPoint[] {
  const rand = mulberry32(seed)
  const pts: ClusterPoint[] = []
  for (const c of NATURAL_CENTERS) {
    for (let i = 0; i < 30; i++) {
      pts.push({
        x: +(c.x + gaussian(rand) * 0.9).toFixed(2),
        y: +(c.y + gaussian(rand) * 0.9).toFixed(2),
      })
    }
  }
  return pts
}

function pickRandomCenters(points: ClusterPoint[], k: number): ClusterPoint[] {
  const idx = points.map((_, i) => i)
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx.slice(0, k).map((i) => ({ ...points[i] }))
}

function assign(points: ClusterPoint[], centers: ClusterPoint[]): number[] {
  return points.map((p) => {
    let best = 0
    let bestD = Infinity
    centers.forEach((c, i) => {
      const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    return best
  })
}

function updateCenters(
  points: ClusterPoint[],
  assignments: number[],
  prevCenters: ClusterPoint[],
): { centers: ClusterPoint[]; moved: number } {
  const k = prevCenters.length
  const sums = Array.from({ length: k }, () => ({ x: 0, y: 0, n: 0 }))
  points.forEach((p, i) => {
    const a = assignments[i]
    sums[a].x += p.x
    sums[a].y += p.y
    sums[a].n += 1
  })
  const centers = sums.map((s, i) =>
    s.n > 0 ? { x: s.x / s.n, y: s.y / s.n } : prevCenters[i],
  )
  let moved = 0
  centers.forEach((c, i) => {
    moved = Math.max(
      moved,
      Math.hypot(c.x - prevCenters[i].x, c.y - prevCenters[i].y),
    )
  })
  return { centers, moved }
}

function inertia(
  points: ClusterPoint[],
  centers: ClusterPoint[],
  assignments: number[],
): number {
  return points.reduce((s, p, i) => {
    const c = centers[assignments[i]]
    return s + (p.x - c.x) ** 2 + (p.y - c.y) ** 2
  }, 0)
}

function initState(k: number, points: ClusterPoint[]): KMeansState {
  return {
    points,
    centers: pickRandomCenters(points, k),
    assignments: [],
    step: 0,
    converged: false,
  }
}

function stepOnce(prev: KMeansState): KMeansState {
  if (prev.converged) return prev
  if (prev.assignments.length === 0) {
    return { ...prev, assignments: assign(prev.points, prev.centers), step: 1 }
  }
  const { centers, moved } = updateCenters(
    prev.points,
    prev.assignments,
    prev.centers,
  )
  const assignments = assign(prev.points, centers)
  return {
    ...prev,
    centers,
    assignments,
    step: prev.step + 1,
    converged: moved < 0.01,
  }
}

export default function KMeansDemo() {
  const [k, setK] = useState(3)
  const [s, setS] = useState<KMeansState>(() => initState(3, makePoints(7)))
  const [playing, setPlaying] = useState(false)

  // 绘图区域固定由数据点决定,聚类中心始终落在数据范围内,画面稳定不跳动。
  const domain = useMemo(() => {
    const xs = s.points.map((p) => p.x)
    const ys = s.points.map((p) => p.y)
    return {
      xMin: Math.min(...xs) - 0.8,
      xMax: Math.max(...xs) + 0.8,
      yMin: Math.min(...ys) - 0.8,
      yMax: Math.max(...ys) + 0.8,
    }
  }, [s.points])

  const sx = (x: number) =>
    PAD + ((x - domain.xMin) / (domain.xMax - domain.xMin)) * (W - 2 * PAD)
  const sy = (y: number) =>
    H - PAD - ((y - domain.yMin) / (domain.yMax - domain.yMin)) * (H - 2 * PAD)

  const assigned = s.assignments.length > 0
  const currentInertia = assigned
    ? inertia(s.points, s.centers, s.assignments)
    : null

  // 自动播放
  useEffect(() => {
    if (!playing || s.converged) return
    const id = setInterval(() => setS((prev) => stepOnce(prev)), 700)
    return () => clearInterval(id)
  }, [playing, s.converged])

  useEffect(() => {
    if (s.converged) setPlaying(false)
  }, [s.converged])

  const changeK = (v: number) => {
    setK(v)
    setPlaying(false)
    setS((prev) => initState(v, prev.points))
  }

  const regen = () => {
    setPlaying(false)
    setS(initState(k, makePoints(Math.floor(Math.random() * 1_000_000))))
  }

  const reset = () => {
    setPlaying(false)
    setS((prev) => initState(k, prev.points))
  }

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900">K-means 聚类演示</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        选择簇的个数 K,点击「下一步」逐步运行 K-means:先把点分配到最近的中心,再重新计算中心,直到中心几乎不再移动。
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label="K-means 聚类图:彩色点为数据,带编号的圆为聚类中心"
          >
            {s.points.map((p, i) => (
              <circle
                key={i}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={4}
                fill={
                  assigned
                    ? PALETTE[s.assignments[i] % PALETTE.length]
                    : '#cbd5e1'
                }
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
            {s.centers.map((c, i) => (
              <g key={`c${i}`}>
                <circle
                  cx={sx(c.x)}
                  cy={sy(c.y)}
                  r={9}
                  fill="#fff"
                  stroke={PALETTE[i % PALETTE.length]}
                  strokeWidth={3}
                />
                <text
                  x={sx(c.x)}
                  y={sy(c.y)}
                  dy={4}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="bold"
                  fill={PALETTE[i % PALETTE.length]}
                >
                  {i + 1}
                </text>
              </g>
            ))}
            <text
              x={W / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize={11}
              fill="#94a3b8"
            >
              特征 1 →
            </text>
            <text
              x={12}
              y={H / 2}
              textAnchor="middle"
              fontSize={11}
              fill="#94a3b8"
              transform={`rotate(-90 12 ${H / 2})`}
            >
              特征 2 →
            </text>
          </svg>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="k-slider" className="text-sm font-medium text-slate-700">
                簇的个数 K
              </label>
              <span className="font-mono text-sm text-slate-600">{k}</span>
            </div>
            <input
              id="k-slider"
              type="range"
              min={2}
              max={6}
              step={1}
              value={k}
              onChange={(e) => changeK(Number(e.target.value))}
              className="mt-1 w-full touch-manipulation accent-violet-600"
            />
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">迭代次数</span>
              <span className="font-mono font-bold text-slate-900">{s.step}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-slate-600">簇内平方和</span>
              <span className="font-mono font-bold text-slate-900">
                {currentInertia === null ? '—' : currentInertia.toFixed(1)}
              </span>
            </div>
            {s.converged && (
              <p className="mt-2 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                ✓ 已收敛
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Button
              onClick={() => setS((prev) => stepOnce(prev))}
              disabled={s.converged}
              className="w-full sm:w-auto"
            >
              下一步
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPlaying((v) => !v)}
              disabled={s.converged}
              className="w-full sm:w-auto"
            >
              {playing ? '暂停' : '自动播放'}
            </Button>
            <Button
              variant="secondary"
              onClick={reset}
              className="w-full sm:w-auto"
            >
              重新初始化
            </Button>
            <Button
              variant="secondary"
              onClick={regen}
              className="w-full sm:w-auto"
            >
              随机数据
            </Button>
          </div>

          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {Array.from({ length: k }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: PALETTE[i] }}
                />
                簇 {i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        当前迭代 {s.step} 次,{s.converged ? '已收敛' : '尚未收敛'}
      </p>
    </Card>
  )
}
