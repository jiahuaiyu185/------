import { useMemo, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { gaussian, mulberry32 } from '../lib/random'

interface Pt {
  x: number
  y: number
}

interface Fit {
  coeffs: number[]
  meanX: number
}

const W = 640
const H = 380
const PAD = 42

// 真实关系是一条平滑的三次曲线,数据在此基础上加高斯噪声。
const TRUE = (x: number) => 2 + 1.5 * x - 0.55 * x * x + 0.06 * x * x * x

function makeData(seed: number): { train: Pt[]; test: Pt[] } {
  const rand = mulberry32(seed)
  const train: Pt[] = []
  const test: Pt[] = []
  // 训练点与测试点交错分布,便于观察"高次数曲线在训练点之间乱跳"的过拟合。
  for (let i = 0; i < 20; i++) {
    const x = 0.4 + i * 0.3
    train.push({ x: +x.toFixed(2), y: +(TRUE(x) + gaussian(rand) * 1.0).toFixed(2) })
  }
  for (let j = 0; j < 9; j++) {
    const x = 0.55 + j * 0.66
    test.push({ x: +x.toFixed(2), y: +(TRUE(x) + gaussian(rand) * 1.0).toFixed(2) })
  }
  return { train, test }
}

// 高斯消元(带部分主元)解线性方程组,用于最小二乘法求多项式系数。
function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length
  const M = A.map((row, i) => [...row, b[i]])
  for (let col = 0; col < n; col++) {
    let piv = col
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r
    }
    if (Math.abs(M[piv][col]) < 1e-12) continue
    ;[M[col], M[piv]] = [M[piv], M[col]]
    const d = M[col][col]
    for (let c = col; c <= n; c++) M[col][c] /= d
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const f = M[r][col]
      if (f === 0) continue
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c]
    }
  }
  return M.map((row) => row[n])
}

// 多项式最小二乘:先对 x 做中心化再建范德蒙德矩阵,避免高次幂数值过大。
function fitPoly(pts: Pt[], degree: number): Fit {
  const n = pts.length
  const meanX = pts.reduce((s, p) => s + p.x, 0) / n
  const m = degree + 1
  const A = Array.from({ length: m }, () => new Array(m).fill(0))
  const b = new Array(m).fill(0)
  for (const p of pts) {
    let acc = 1
    const powers: number[] = []
    for (let k = 0; k < m; k++) {
      powers.push(acc)
      acc *= p.x - meanX
    }
    for (let r = 0; r < m; r++) {
      b[r] += powers[r] * p.y
      for (let c = 0; c < m; c++) A[r][c] += powers[r] * powers[c]
    }
  }
  return { coeffs: solveLinear(A, b), meanX }
}

function evalPoly(fit: Fit, x: number): number {
  let out = 0
  let acc = 1
  const z = x - fit.meanX
  for (const c of fit.coeffs) {
    out += c * acc
    acc *= z
  }
  return out
}

function mseOf(pts: Pt[], fit: Fit): number {
  return (
    pts.reduce((s, p) => {
      const d = p.y - evalPoly(fit, p.x)
      return s + d * d
    }, 0) / pts.length
  )
}

function fmt(v: number) {
  if (!Number.isFinite(v)) return '—'
  if (Math.abs(v) >= 100) return v.toFixed(0)
  return String(+v.toFixed(2))
}

function ticks(min: number, max: number, n: number) {
  return Array.from({ length: n }, (_, i) => min + ((max - min) * i) / (n - 1))
}

const CURVE_N = 180

export default function PolynomialOverfittingDemo() {
  const [data, setData] = useState(() => makeData(42))
  const [degree, setDegree] = useState(3)

  const fit = useMemo(() => fitPoly(data.train, degree), [data, degree])
  const trainMse = mseOf(data.train, fit)
  const testMse = mseOf(data.test, fit)

  const allYs = [...data.train, ...data.test].map((p) => p.y)
  const dataMin = Math.min(...allYs)
  const dataMax = Math.max(...allYs)
  // 绘图纵轴固定到数据范围 + 固定边距,高次数曲线的剧烈波动会自然被裁剪出画面,突出"过拟合"。
  const yMin = dataMin - 1.6
  const yMax = dataMax + 1.6
  const xMin = 0.1
  const xMax = 6.5

  const sx = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD)
  const sy = (y: number) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD)

  const curve = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    for (let i = 0; i <= CURVE_N; i++) {
      const x = xMin + ((xMax - xMin) * i) / CURVE_N
      pts.push({ x, y: evalPoly(fit, x) })
    }
    return pts
  }, [fit, xMin, xMax])

  const pathD = curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
    .join(' ')

  const overfit = testMse > trainMse * 2 && testMse > 4

  const regen = () => setData(makeData(Math.floor(Math.random() * 1_000_000)))

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900">多项式回归与过拟合演示</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        拖动滑块选择多项式次数 degree。次数越高,曲线越能"贴合"训练点,但会把噪声也学进去,在测试点上反而乱跳——这就是过拟合。
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full overflow-hidden"
            role="img"
            aria-label="多项式回归拟合图:蓝色为训练点,绿色为测试点,紫色为当前次数拟合曲线"
          >
            {ticks(yMin, yMax, 5).map((v, i) => (
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
            {ticks(xMin, xMax, 7).map((v, i) => (
              <line
                key={`v${i}`}
                x1={sx(v)}
                y1={sy(yMin)}
                x2={sx(v)}
                y2={sy(yMax)}
                stroke="#eef2f7"
                strokeWidth={1}
              />
            ))}

            <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth={2.5} />

            {data.test.map((p, i) => (
              <circle
                key={`t${i}`}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={4}
                fill="#10b981"
                stroke="#fff"
                strokeWidth={1.5}
              />
            ))}
            {data.train.map((p, i) => (
              <circle
                key={`p${i}`}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={4}
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth={1.5}
              />
            ))}

            {ticks(xMin, xMax, 7).map((v, i) => (
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
            {ticks(yMin, yMax, 5).map((v, i) => (
              <text
                key={`yt${i}`}
                x={PAD - 8}
                y={sy(v) + 4}
                textAnchor="end"
                fontSize={11}
                fill="#94a3b8"
              >
                {fmt(v)}
              </text>
            ))}
          </svg>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="degree-slider" className="text-sm font-medium text-slate-700">
                多项式次数 degree
              </label>
              <span className="font-mono text-sm text-slate-600">{degree}</span>
            </div>
            <input
              id="degree-slider"
              type="range"
              min={1}
              max={9}
              step={1}
              value={degree}
              onChange={(e) => setDegree(Number(e.target.value))}
              className="mt-1 w-full touch-manipulation accent-indigo-600"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>1(直线)</span>
              <span>9(高次)</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">训练 MSE</span>
              <span className="font-mono font-bold text-slate-900">{fmt(trainMse)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">测试 MSE</span>
              <span
                className={`font-mono font-bold ${overfit ? 'text-rose-600' : 'text-emerald-600'}`}
              >
                {fmt(testMse)}
              </span>
            </div>
            {overfit && (
              <p className="mt-2 rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
                ⚠️ 测试误差明显大于训练误差,已经过拟合
              </p>
            )}
          </div>

          <Button variant="secondary" onClick={regen} className="w-full">
            重新生成数据
          </Button>

          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> 训练点
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> 测试点
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-indigo-600" /> 拟合曲线
            </span>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        当前次数 {degree},训练 MSE {fmt(trainMse)},测试 MSE {fmt(testMse)}
      </p>
    </Card>
  )
}
