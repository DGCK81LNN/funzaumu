import { makeAbsolute, parseSVG } from "svg-path-parser"
import fromExponential from "from-exponential"

export type SplineCommand = readonly [
  args: readonly number[],
  code: "m" | "l" | "c",
  modifiers?: unknown,
]

type vector2 = readonly [x: number, y: number]
type CurveArgs = readonly [
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
]

export function pathToSplineSet(
  path: string,
  { scale = 1, offsetX = 0, offsetY = 800 } = {},
): string {
  const spline: SplineCommand[] = []
  let pos: vector2 = [0, 0]
  let lastMove: vector2 = [0, 0]
  let lastCommand = ""
  let lastControl: vector2 = [0, 0]

  const tr = (args: readonly number[]) =>
    args.map((n, i) =>
      i % 2 === 0 ? n * scale + offsetX : n * -scale + offsetY,
    )

  for (const cm of makeAbsolute(parseSVG(path))) {
    switch (cm.code) {
      case "M":
        spline.push([tr([cm.x, cm.y]), "m", 0])
        pos = [cm.x, cm.y]
        lastMove = [cm.x, cm.y]
        break
      case "L":
        spline.push([tr([cm.x, cm.y]), "l", 0])
        pos = [cm.x, cm.y]
        break
      case "H":
        spline.push([tr([cm.x, pos[1]]), "l", 0])
        pos = [cm.x, pos[1]]
        break
      case "V":
        spline.push([tr([pos[0], cm.y]), "l", 0])
        pos = [pos[0], cm.y]
        break
      case "C":
        spline.push([tr([cm.x1, cm.y1, cm.x2, cm.y2, cm.x, cm.y]), "c", 0])
        pos = [cm.x, cm.y]
        lastControl = [cm.x2, cm.y2]
        break
      case "S": {
        const implicitControl = "CS".includes(lastCommand) ? lastControl : pos
        const x1 = pos[0] * 2 - implicitControl[0]
        const y1 = pos[1] * 2 - implicitControl[1]
        spline.push([tr([x1, y1, cm.x2, cm.y2, cm.x, cm.y]), "c", 0])
        pos = [cm.x, cm.y]
        lastControl = [cm.x2, cm.y2]
        break
      }
      case "Q":
        spline.push([tr(q2c(pos[0], pos[1], cm.x1, cm.y1, cm.x, cm.y)), "c", 0])
        pos = [cm.x, cm.y]
        lastControl = [cm.x1, cm.y1]
        break
      case "T": {
        const implicitControl = "QT".includes(lastCommand) ? lastControl : pos
        const x1 = pos[0] * 2 - implicitControl[0]
        const y1 = pos[1] * 2 - implicitControl[1]
        spline.push([tr(q2c(pos[0], pos[1], x1, y1, cm.x, cm.y)), "c", 0])
        pos = [cm.x, cm.y]
        lastControl = [x1, y1]
        break
      }
      case "A":
        for (const stepArgs of /*prettier-ignore*/ a2c(
          pos[0], pos[1],
          cm.rx, cm.ry, cm.xAxisRotation,
          cm.largeArc, cm.sweep,
          cm.x, cm.y
        ))
          spline.push([tr(stepArgs), "c", 0])
        pos = [cm.x, cm.y]
        break
      case "Z":
        if (lastMove[0] !== pos[0] || lastMove[1] !== pos[1])
          spline.push([tr([lastMove[0], lastMove[1]]), "l", 0])
        break
    }
    lastCommand = cm.code
  }
  return spline
    .map(([args, ...rest]) =>
      [
        ...args.map((n) =>
          fromExponential(n.toFixed(2)).replace(/\.0*$|(\.\d+)0+$/, "$1"),
        ),
        ...rest,
      ].join(" "),
    )
    .join("\n")
}

// Adapted from https://github.com/adobe-webplatform/Snap.svg/blob/c8e483c9694517e24b282f8f59f985629f4994ce/src/path.js#L740-L843
export function q2c(
  x1: number,
  y1: number,
  ax: number,
  ay: number,
  x2: number,
  y2: number,
): CurveArgs {
  const _13 = 1 / 3
  const _23 = 2 / 3
  return [
    _13 * x1 + _23 * ax,
    _13 * y1 + _23 * ay,
    _13 * x2 + _23 * ax,
    _13 * y2 + _23 * ay,
    x2,
    y2,
  ]
}
export function a2c(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  angle: number,
  large_arc_flag: boolean,
  sweep_flag: boolean,
  x2: number,
  y2: number,
): CurveArgs[] {
  const _120 = (Math.PI * 120) / 180
  var rad = (Math.PI / 180) * (+angle || 0)
  if (!rx || !ry) {
    return [[x1, y1, x2, y2, x2, y2]]
  }
  ;[x1, y1] = rotate(x1, y1, -rad)
  ;[x2, y2] = rotate(x2, y2, -rad)
  var x = (x1 - x2) / 2
  var y = (y1 - y2) / 2
  var h = (x * x) / (rx * rx) + (y * y) / (ry * ry)
  if (h > 1) {
    h = Math.sqrt(h)
    rx = h * rx
    ry = h * ry
  }
  var rx2 = rx * rx
  var ry2 = ry * ry
  var k =
    (large_arc_flag == sweep_flag ? -1 : 1) *
    Math.sqrt(
      Math.abs(
        (rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x),
      ),
    )
  var cx = (k * rx * y) / ry + (x1 + x2) / 2
  var cy = (k * -ry * x) / rx + (y1 + y2) / 2
  var f1 = Math.asin((y1 - cy) / ry)
  var f2 = Math.asin((y2 - cy) / ry)

  f1 = x1 < cx ? Math.PI - f1 : f1
  f2 = x2 < cx ? Math.PI - f2 : f2
  f1 < 0 && (f1 = Math.PI * 2 + f1)
  f2 < 0 && (f2 = Math.PI * 2 + f2)
  if (sweep_flag && f1 > f2) {
    f1 = f1 - Math.PI * 2
  }
  if (!sweep_flag && f2 > f1) {
    f2 = f2 - Math.PI * 2
  }
  return __recursion(x1, y1, x2, y2, f1, f2).map((res) => {
    var newres: number[] = []
    for (var i = 0, ii = res.length; i < ii; i++) {
      newres[i] =
        i % 2
          ? rotate(res[i - 1], res[i], rad)[1]
          : rotate(res[i], res[i + 1], rad)[0]
    }
    return newres as readonly number[] as CurveArgs
  })

  function rotate(x: number, y: number, rad: number) {
    var X = x * Math.cos(rad) - y * Math.sin(rad),
      Y = x * Math.sin(rad) + y * Math.cos(rad)
    return [X, Y]
  }

  function __recursion(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    f1: number,
    f2: number,
  ): CurveArgs[] {
    var res: CurveArgs[] = []
    var df = f2 - f1
    if (Math.abs(df) > _120) {
      var f2old = f2
      var x2old = x2
      var y2old = y2
      f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1)
      x2 = cx + rx * Math.cos(f2)
      y2 = cy + ry * Math.sin(f2)
      res = __recursion(x2, y2, x2old, y2old, f2, f2old)
    }
    df = f2 - f1
    var c1 = Math.cos(f1)
    var s1 = Math.sin(f1)
    var c2 = Math.cos(f2)
    var s2 = Math.sin(f2)
    var t = Math.tan(df / 4)
    var hx = (4 / 3) * rx * t
    var hy = (4 / 3) * ry * t
    var m1 = [x1, y1]
    var m2 = [x1 + hx * s1, y1 - hy * c1]
    var m3 = [x2 + hx * s2, y2 - hy * c2]
    var m4 = [x2, y2]
    m2[0] = 2 * m1[0] - m2[0]
    m2[1] = 2 * m1[1] - m2[1]
    return [[m2[0], m2[1], m3[0], m3[1], m4[0], m4[1]] as CurveArgs].concat(res)
  }
}
