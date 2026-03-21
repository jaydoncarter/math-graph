const e=[{type:"definition",content:"A triangle is a polygon with exactly three vertices, three edges, and three interior angles. It is the simplest closed polygon and forms the foundation of Euclidean geometry, trigonometry, and countless results in analysis and topology."},{type:"svg",content:`
<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"
     style="width:100%;max-width:300px;display:block;margin:0 auto">

  <!-- filled triangle -->
  <polygon points="50,175 250,175 155,30"
           fill="#e2b96f0d" stroke="#e2b96f" stroke-width="1.5"
           stroke-linejoin="round"/>

  <!-- vertex labels -->
  <text x="30"  y="193" fill="#d4c5a9"
        font-family="IM Fell English,Georgia,serif" font-size="15">A</text>
  <text x="253" y="193" fill="#d4c5a9"
        font-family="IM Fell English,Georgia,serif" font-size="15">B</text>
  <text x="148" y="22"  fill="#d4c5a9"
        font-family="IM Fell English,Georgia,serif" font-size="15">C</text>

  <!-- side labels  (a = BC, b = CA, c = AB) -->
  <text x="214" y="112" fill="#8a9aaa"
        font-family="IM Fell English,Georgia,serif" font-size="13"
        font-style="italic">a</text>
  <text x="76"  y="112" fill="#8a9aaa"
        font-family="IM Fell English,Georgia,serif" font-size="13"
        font-style="italic">b</text>
  <text x="146" y="193" fill="#8a9aaa"
        font-family="IM Fell English,Georgia,serif" font-size="13"
        font-style="italic">c</text>

  <!-- angle arcs -->
  <!-- α at A (50,175) -->
  <path d="M 72,175 A 22,22 0 0,0 59,154"
        fill="none" stroke="#5a6a7a" stroke-width="1.2"/>
  <text x="68" y="162" fill="#5a6a7a"
        font-family="IM Fell English,Georgia,serif" font-size="11"
        font-style="italic">α</text>

  <!-- β at B (250,175) -->
  <path d="M 228,175 A 22,22 0 0,1 241,154"
        fill="none" stroke="#5a6a7a" stroke-width="1.2"/>
  <text x="227" y="162" fill="#5a6a7a"
        font-family="IM Fell English,Georgia,serif" font-size="11"
        font-style="italic">β</text>

  <!-- γ at C (155,30) -->
  <path d="M 144,50 A 22,22 0 0,1 167,50"
        fill="none" stroke="#5a6a7a" stroke-width="1.2"/>
  <text x="148" y="63" fill="#5a6a7a"
        font-family="IM Fell English,Georgia,serif" font-size="11"
        font-style="italic">γ</text>
</svg>`},{type:"section",title:"Angle Sum"},{type:"text",content:"The interior angles of any triangle in the Euclidean plane always sum to exactly π radians (180°). This is one of the most fundamental — and non-trivial — results in Euclidean geometry; it fails in spherical and hyperbolic geometries."},{type:"latex",content:"\\alpha + \\beta + \\gamma = \\pi"},{type:"note",noteType:"proof",content:"Draw a line through C parallel to AB. The angle on each side of C equals α and β respectively (alternate interior angles). The three angles at C then tile a straight line, summing to π. ∎"},{type:"section",title:"Area"},{type:"text",content:"The area can be expressed in several equivalent ways depending on which measurements are known. The base-height formula requires a perpendicular height; Heron's formula requires only the three side lengths."},{type:"latex",content:"\\text{Area} = \\tfrac{1}{2}\\,c\\,h_c = \\tfrac{1}{2}\\,ab\\sin\\gamma"},{type:"text",content:"Heron's formula — letting s = (a + b + c)/2 be the semi-perimeter:"},{type:"latex",content:"\\text{Area} = \\sqrt{s(s-a)(s-b)(s-c)}, \\quad s = \\frac{a+b+c}{2}"},{type:"note",noteType:"info",content:"The sine-area formula ½ ab sin γ is particularly useful in trigonometry because it works even when the height is unknown. It is also the starting point for the proof of the Law of Sines."},{type:"section",title:"Classification"},{type:"text",content:"Triangles are classified in two independent ways:"},{type:"list",ordered:!1,items:[[{type:"text",content:"By angles — "},{type:"latex",content:"\\text{acute}"},{type:"text",content:" (all angles < 90°), "},{type:"latex",content:"\\text{right}"},{type:"text",content:" (one angle = 90°), "},{type:"latex",content:"\\text{obtuse}"},{type:"text",content:" (one angle > 90°)."}],[{type:"text",content:"By sides — "},{type:"latex",content:"\\text{equilateral}"},{type:"text",content:" ("},{type:"latex",content:"a = b = c"},{type:"text",content:"), "},{type:"latex",content:"\\text{isosceles}"},{type:"text",content:" (two sides equal), "},{type:"latex",content:"\\text{scalene}"},{type:"text",content:" (all sides different)."}]]},{type:"text",content:"An equilateral triangle is necessarily equiangular (each angle is exactly π/3), demonstrating that the two classification schemes are not independent for extreme cases."},{type:"latex",content:"\\text{Equilateral:}\\quad a = b = c \\implies \\alpha = \\beta = \\gamma = \\frac{\\pi}{3}"},{type:"section",title:"Circumradius"},{type:"text",content:"Every triangle has a unique circumscribed circle. Its radius R is determined by the Law of Sines:"},{type:"latexInline",content:"R = \\dfrac{a}{2\\sin\\alpha} = \\dfrac{b}{2\\sin\\beta} = \\dfrac{c}{2\\sin\\gamma}"},{type:"note",noteType:"warning",content:"All results above assume Euclidean (flat) geometry. On a sphere, the angle sum exceeds π — a spherical triangle covering one octant of the globe has three right angles, summing to 3π/2. In hyperbolic geometry the angle sum is strictly less than π."}];export{e as blocks};
