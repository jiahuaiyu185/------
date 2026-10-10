import { useMemo, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { gaussian, mulberry32 } from '../lib/random'

interface Lp {
  x: number
  y: 0 | 1
}

const W = 640
const H = 380
const PAD = 42
const XMAX = 6

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))

function makeData(seed: number): Lp[] {
  const rand = mulberry32(seed)
  const pts: Lp[] = []
  for (let i = 0; i < 30; i++) {
    const x = 0.3 + i * (5.4 / 29)
    const y = x + gaussian(rand) * 0.8 > 3.0 ? 1 : 0
    pts.push({ x: +x.toFixed(2), y })
  }
  return pts
}

// 逻辑回归:梯度下降最小化交叉熵。x 先归一化到 0~1,保证收敛稳定。
function fitLogistic(pts: Lp[]): { w: number; b: number } {
  let w = 0
  let b = 0
  const lr = 0.6
  const n = pts.length
  for (let i = 0; i < 6000; i++) {
    let gw = 0
    let gb = 0
    for (const p of pts) {
      const z = w * (p.x / XMAX) + b
      const d = sigmoid(z) - p.y
      gw += d * (p.x / XMAX)
      gb += d
    }
    w -= (lr * gw) / n
    b -= (lr * gb) / n
  }
  return { w, b }
}

function probAt(model: { w: number; b: number }, x: number) {
  return sigmoid(model.w * (x / XMAX) + model.b)
}

function fmt(v: number) {
  if (Math.abs(v) >= 100) return v.toFixed(0)
  return String(+v.toFixed(2))
}

const CURVE_N = 180

export default function LogisticThresholdDemo() {
  const [data, setData] = useState(() => makeData(7))
  const [threshold, setThreshold] = useState(0.5)

  const model = useMemo(() => fitLogistic(data), [data])

  const stats = useMemo(() => {
    let tp = 0
    let fp = 0
    let tn = 0
    let fn = 0
    const preds = data.map((p) => (probAt(model, p.x) >= threshold ? 1 : 0))
    data.forEach((p, i) => {
      const pred = preds[i]
      if (p.y === 1 && pred === 1) tp++
      else if (p.y === 0 && pred === 1) fp++
      else if (p.y === 0 && pred === 0) tn++
      else fn++
    })
    const precision = tp + fp === 0 ? 0 : tp / (tp + fp)
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn)
    const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall)
    return { tp, fp, tn, fn, preds, precision, recall, f1 }
  }, [data, model, threshold])

  const xMin = 0
  const xMax = XMAX
  const yMin = -0.12
  const yMax = 1.12

  const sx = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD)
  const sy = (y: number) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD)

  const curve = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    for (let i = 0; i <= CURVE_N; i++) {
      const x = xMin + ((xMax - xMin) * i) / CURVE_N
      pts.push({ x, y: probAt(model, x) })
    }
    return pts
  }, [model, xMin, xMax])

  const pathD = curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
    .join(' ')

  // 决策边界:令 sigmoid = 阈值,反解出 x。
  const logit = Math.log(threshold / (1 - threshold))
  const xStar = model.w !== 0 ? (XMAX * (logit - model.b)) / model.w : NaN
  const showBoundary = Number.isFinite(xStar) && xStar >= xMin && xStar <= xMax

  const regen = () => setData(makeData(Math.floor(Math.random() * 1_000_000)))

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900">逻辑回归阈值演示</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        曲线是模型输出的"通过概率"。拖动阈值,凡概率 ≥ 阈值的点被判为"通过"(蓝点)。调低阈值会找到更多真正通过的人(召回率升),但误判也变多(精确率降)。
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label="逻辑回归概率曲线:点为样本,横轴学习时间,纵轴通过概率,虚线为当前阈值"
          >
            {ticksY(yMin, yMax).map((v, i) => (
              <line
                key={`h${i}`}
                x1={sx(xMin)}
                y1={sy(v)}
                x2={sx(xMax)}
                y2={sy(v)}
                stroke="#eef2f7"
                strokeWidth={1}
              />
            ))}

            <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth={2.5} />

            {/* 阈值横线 */}
            <line
              x1={sx(xMin)}
              y1={sy(threshold)}
              x2={sx(xMax)}
              y2={sy(threshold)}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            {showBoundary && (
              <line
                x1={sx(xStar)}
                y1={sy(0)}
                x2={sx(xStar)}
                y2={sy(threshold)}
                stroke="#fb7185"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            )}

            {data.map((p, i) => (
              <circle
                key={`p${i}`}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={4.5}
                fill={stats.preds[i] === 1 ? '#3b82f6' : '#cbd5e1'}
                stroke="#fff"
                strokeWidth={1.5}
              />
            ))}

            {ticksX(xMin, xMax).map((v, i) => (
              <text
                key={`xt${i}`}
                x={sx(v)}
                y={H - PAD + 18}
                textAnchor="middle"
                fontSize={11}
                fill="#94a3b8"
              >
                {fmt(v)}
              </text>
            ))}
            <text x={PAD - 8} y={sy(1) + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
              1
            </text>
            <text x={PAD - 8} y={sy(0) + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
              0
            </text>
          </svg>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="threshold-slider" className="text-sm font-medium text-slate-700">
                阈值 threshold
              </label>
              <span className="font-mono text-sm text-slate-600">{threshold.toFixed(2)}</span>
            </div>
            <input
              id="threshold-slider"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="mt-1 w-full touch-manipulation accent-violet-600"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>0(宽松)</span>
              <span>1(严格)</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              混淆矩阵(行=实际,列=预测)
            </p>
            <div className="mt-2 grid grid-cols-[2.5fr_1fr_1fr] gap-1 text-center text-sm">
              <span />
              <span className="font-medium text-slate-500">预测 0</span>
              <span className="font-medium text-slate-500">预测 1</span>
              <span className="self-center text-left font-medium text-slate-500">实际 0</span>
              <span className="rounded bg-white py-1.5 font-mono text-slate-700">{stats.tn}</span>
              <span className="rounded bg-white py-1.5 font-mono text-slate-700">{stats.fp}</span>
              <span className="self-center text-left font-medium text-slate-500">实际 1</span>
              <span className="rounded bg-white py-1.5 font-mono text-slate-700">{stats.fn}</span>
              <span className="rounded bg-white py-1.5 font-mono text-slate-700">{stats.tp}</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">精确率</span>
              <span className="font-mono font-bold text-slate-900">{pct(stats.precision)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">召回率</span>
              <span className="font-mono font-bold text-slate-900">{pct(stats.recall)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">F1</span>
              <span className="font-mono font-bold text-slate-900">{pct(stats.f1)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setThreshold(0.5)} className="flex-1">
              复位到 0.5
            </Button>
            <Button variant="secondary" onClick={regen} className="flex-1">
              重新生成数据
            </Button>
          </div>

          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> 预测为通过
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-300" /> 预测为不通过
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-amber-400" /> 阈值
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-rose-400" /> 决策边界
            </span>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        当前阈值 {threshold.toFixed(2)},精确率 {pct(stats.precision)},召回率 {pct(stats.recall)}
      </p>
    </Card>
  )
}

function ticksX(min: number, max: number) {
  return Array.from({ length: 7 }, (_, i) => min + ((max - min) * i) / 6)
}

function ticksY(min: number, max: number) {
  return Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4)
}
