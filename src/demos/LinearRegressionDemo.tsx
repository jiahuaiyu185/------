import { useMemo, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { gaussian, mulberry32 } from '../lib/random'

interface Point {
  x: number
  y: number
}

// 数据由一条"真实直线" y = TRUE_W·x + TRUE_B 加上高斯噪声生成。
const TRUE_W = 2
const TRUE_B = 3
const W = 640
const H = 380
const PAD = 42

function makePoints(seed: number): Point[] {
  const rand = mulberry32(seed)
  const pts: Point[] = []
  for (let i = 0; i < 24; i++) {
    const x = 0.5 + i * 0.4
    const y = TRUE_W * x + TRUE_B + gaussian(rand) * 1.3
    pts.push({ x: +x.toFixed(2), y: +y.toFixed(2) })
  }
  return pts
}

function leastSquares(pts: Point[]) {
  const n = pts.length
  const sx = pts.reduce((s, p) => s + p.x, 0)
  const sy = pts.reduce((s, p) => s + p.y, 0)
  const sxy = pts.reduce((s, p) => s + p.x * p.y, 0)
  const sxx = pts.reduce((s, p) => s + p.x * p.x, 0)
  const w = (n * sxy - sx * sy) / (n * sxx - sx * sx)
  const b = (sy - w * sx) / n
  return { w, b }
}

function mse(pts: Point[], w: number, b: number) {
  const n = pts.length
  return pts.reduce((s, p) => {
    const d = p.y - (w * p.x + b)
    return s + d * d
  }, 0) / n
}

function fmt(v: number) {
  if (Math.abs(v) >= 100) return v.toFixed(0)
  return String(+v.toFixed(1))
}

function ticks(min: number, max: number, n: number) {
  return Array.from({ length: n }, (_, i) => min + ((max - min) * i) / (n - 1))
}

function Slider({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, +v.toFixed(2)))

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <span className="font-mono text-sm text-slate-600">{value.toFixed(2)}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          aria-label={`${label}减小`}
          onClick={() => onChange(clamp(value - step))}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-medium text-slate-600 transition hover:bg-slate-50 active:bg-slate-100"
        >
          −
        </button>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-6 w-full touch-manipulation accent-blue-600"
        />
        <button
          type="button"
          aria-label={`${label}增大`}
          onClick={() => onChange(clamp(value + step))}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-medium text-slate-600 transition hover:bg-slate-50 active:bg-slate-100"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function LinearRegressionDemo() {
  const [points, setPoints] = useState<Point[]>(() => makePoints(42))
  const [w, setW] = useState(1)
  const [b, setB] = useState(1)
  const [showOptimal, setShowOptimal] = useState(true)

  const opt = useMemo(() => leastSquares(points), [points])
  const currentMse = mse(points, w, b)
  const optimalMse = mse(points, opt.w, opt.b)

  const xs = points.map((p) => p.x)
  const xDataMin = Math.min(...xs)
  const xDataMax = Math.max(...xs)
  const xMin = Math.min(xDataMin, 0) - 0.5
  const xMax = Math.max(xDataMax, 10) + 0.5

  const lineYAt = (x: number) => w * x + b
  const allYs = [
    ...points.map((p) => p.y),
    lineYAt(xMin),
    lineYAt(xMax),
    0,
  ]
  let yMin = Math.min(...allYs)
  let yMax = Math.max(...allYs)
  const yPad = (yMax - yMin) * 0.12 || 1
  yMin -= yPad
  yMax += yPad

  const sx = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD)
  const sy = (y: number) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD)

  const setToOptimal = () => {
    setW(+opt.w.toFixed(2))
    setB(+opt.b.toFixed(2))
  }

  const regen = () => {
    setPoints(makePoints(Math.floor(Math.random() * 1_000_000)))
  }

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900">线性回归交互演示</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        拖动滑块(或点击 +/− 按钮微调)调整直线的斜率 w 和截距 b,实时观察拟合直线、方程参数与均方误差 MSE 如何一起变化。虚线是数据的最小二乘最优解。
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label="线性回归拟合图:蓝色点为数据,实线为当前拟合直线,红色虚线为每个点的残差"
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
            {ticks(xMin, xMax, 6).map((v, i) => (
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

            {xMin <= 0 && 0 <= xMax && (
              <line x1={sx(0)} y1={sy(yMin)} x2={sx(0)} y2={sy(yMax)} stroke="#cbd5e1" strokeWidth={1} />
            )}
            {yMin <= 0 && 0 <= yMax && (
              <line x1={sx(xMin)} y1={sy(0)} x2={sx(xMax)} y2={sy(0)} stroke="#cbd5e1" strokeWidth={1} />
            )}

            {showOptimal && (
              <line
                x1={sx(xMin)}
                y1={sy(opt.w * xMin + opt.b)}
                x2={sx(xMax)}
                y2={sy(opt.w * xMax + opt.b)}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            )}

            {points.map((p, i) => (
              <line
                key={`r${i}`}
                x1={sx(p.x)}
                y1={sy(p.y)}
                x2={sx(p.x)}
                y2={sy(lineYAt(p.x))}
                stroke="#fb7185"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            ))}

            <line
              x1={sx(xMin)}
              y1={sy(lineYAt(xMin))}
              x2={sx(xMax)}
              y2={sy(lineYAt(xMax))}
              stroke="#4f46e5"
              strokeWidth={2.5}
            />

            {points.map((p, i) => (
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

            {ticks(xMin, xMax, 6).map((v, i) => (
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
          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-4 text-white">
            <p className="text-xs font-medium text-white/80">当前拟合方程</p>
            <p className="mt-1 font-mono text-2xl font-bold leading-tight">
              ŷ = {w.toFixed(2)}·x {b >= 0 ? '+' : '−'} {Math.abs(b).toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-white/80">
              斜率 w = {w.toFixed(2)}　截距 b = {b.toFixed(2)}
            </p>
          </div>
          <Slider
            id="slider-w"
            label="斜率 w"
            min={-1}
            max={5}
            step={0.05}
            value={w}
            onChange={setW}
          />
          <Slider
            id="slider-b"
            label="截距 b"
            min={-5}
            max={15}
            step={0.05}
            value={b}
            onChange={setB}
          />

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">你的 MSE</span>
              <span className="font-mono font-bold text-slate-900">
                {currentMse.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">最优 MSE</span>
              <span className="font-mono font-bold text-emerald-600">
                {optimalMse.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="secondary"
              onClick={setToOptimal}
              className="w-full sm:w-auto"
            >
              设为最优
            </Button>
            <Button
              variant="secondary"
              onClick={regen}
              className="w-full sm:w-auto"
            >
              重新生成数据
            </Button>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={showOptimal}
              onChange={(e) => setShowOptimal(e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            显示最优直线
          </label>

          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-indigo-600" /> 你的直线
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-emerald-500" /> 最优直线
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> 数据点
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-rose-400" /> 残差
            </span>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        当前斜率 w = {w.toFixed(2)},截距 b = {b.toFixed(2)},均方误差 {currentMse.toFixed(2)}
      </p>
    </Card>
  )
}
