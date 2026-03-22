/**
 * conceptData.js
 * 
 * To add a node to the tree, create a new item in this list. First, ensure all the item attributes are
 * correctly implemented according to their contracts; then if rich text is necessary, set the optional
 * hasRichContent attribute to true. Create a rich text file according to the contract defined in _TEMPLATE.js.
 * 
 * Please note, the graph will not render if it is not acyclic; thus, please insure new nodes do not create
 * loops. If the graph is not rendering, that is likely the issue.
 *
 * ─── conceptData Item Contract ────────────────────────────────────────────────────
 *
 *  id           A unique snake_case idenitifer that is used as the reference for the 
 *               node when building the graph and in other nodes' depends_on lists. If
 *               there are duplicate ids, the graph will not render properly.
 * 
 *  name         Similar to the ID, a consice and accurate name for the concept. This will
 *               appear at the top of the node description. Aim to keep the id and name as 
 *               similar as possible.
 *
 *  definition   A consice, fundamental description of the concept. No more that three 
 *               sentences. If more information is required to define a concept, use a 
 *               rich node. 
 *
 *  latex        A short LaTeX mathematical representation that is rendered by KaTeX. 
 *               If the LaTeX is long enough that it causes the scroll bar to appear at 
 *               the bottom of the display window, either use a carriage return to 
 *               seperate parts of the LaTeX, or use a rich node.
 *
 *  depends_on    The dependency agency list for this node. The ids in this list cannot 
 *                belong to nodes that this node unlocks or leads to, directly or 
 *                indirectly. Each id should be a concept that this node directly depends 
 *                on, derives from, or is influenced by. There must be at least id, but no 
 *                more than is necessary.
 *
 *  hasRichContent  An optional boolean flag that indicates to the graph renderer whether
 *                  to override the basic content with a rich content file, as defined by 
 *                  _TEMPLATE.js. Even if this is set to true, if the corresponding js file
 *                  in content with the same name as this node's id does not exist or is 
 *                  invalid, the graph will default to rendering the basic content. See 
 *                   _TEMPLATE.js for the contract for creating a rich node.
 */

export const conceptData = [
    {
    id: "law_of_identity", name: "Law of Identity",
    definition: "A fundamental principle of logic stating that an object is identical to itself.",
    latex: "a = a",
    depends_on: []
  },
    {
    id: "law_of_noncontradiction", name: "Law of Non Contradiction",
    definition: "A fundamental principle of logic stating that a statement cannot be both true and false simultaneously.",
    latex: "\\neg(P \\land \\neg P)",
    depends_on: []
  },
      {
    id: "law_of_excluded_middle", name: "Law of Excluded Middle",
    definition: "A fundamental principle of logic stating that a statement is either true or false.",
    latex: "P \\lor \\neg P",
    depends_on: []
  },
  {
  id: "modus_ponens", name: "Modus Ponens",
  definition: "If a conditional statement is true and its hypothesis is true, then its conclusion must be true.",
  latex: "(P \\Rightarrow Q) \\land P \\vdash Q",
  depends_on: ["law_of_noncontradiction", "law_of_excluded_middle"]
},
{
  id: "proof_by_contradiction", name: "Proof by Contradiction",
  definition: "A proof technique that assumes the negation of a statement and derives a logical contradiction, thereby proving the original statement.",
  latex: "\\neg P \\Rightarrow \\bot \\implies P",
  depends_on: ["law_of_noncontradiction", "deduction"]
},
{
  id: "induction", name: "Induction",
  definition: "A proof technique for proving statements about natural numbers: prove a base case, then prove that truth at n implies truth at n+1.",
  latex: "P(1) \\land (P(n) \\Rightarrow P(n+1)) \\\\ \\implies \\forall n\\, P(n)",
  depends_on: ["natural_numbers", "deduction"]
},
    {
    id: "deduction", name: "Deduction Theorem",
    definition: "A logical process of deriving specific, guaranteed conclusions from general premises, axioms, or known facts. If you can prove Q assuming P, then you can prove P implies Q outright.",
    latex: "(P \\vdash Q) \\implies (\\vdash P \\Rightarrow Q)",
    depends_on: ["law_of_identity", "law_of_noncontradiction", "law_of_excluded_middle"]
  },
  {
    id: "set", name: "Set",
    definition: "Sets are collections of distinct objects, called elements.",
    latex: "x \\in A",
    depends_on: ["deduction"]
  },
  {
    id: "union", name: "Set Union",
    definition: "The union of two sets is the set of all elements that are in either set.",
    latex: "A \\cup B = \\{x \\mid x \\in A \\text{ or } x \\in B\\}",
    depends_on: ["set"]
  },
  {
    id: "intersection", name: "Set Intersection",
    definition: "The intersection of two sets is the set of all elements that are in both sets.",
    latex: "A \\cap B = \\{x \\mid x \\in A \\land x \\in B\\}",
    depends_on: ["set"]
  },
  {
    id: "subset", name: "Subset",
    definition: "A set A is a subset of set B if every element of A is also an element of B.",
    latex: "A \\subseteq B \\iff \\\\ \\forall x (x \\in A \\implies x \\in B)",
    depends_on: ["set"]
  },
  {
    id: "whole_numbers", name: "Whole Numbers",
    definition: "Whole numbers are the set of all non-negative integers, starting from 0 and extending to infinity.",
    latex: "\\mathbb{W} = \\{0, 1, 2, 3, \\ldots\\}",
    depends_on: ["set"]
  },
  {
    id: "integers", name: "Integers",
    definition: "Integers are the set of all whole numbers, both positive and negative, including zero.",
    latex: "\\mathbb{Z} = \\{\\ldots, -2, -1, 0, 1, 2, \\ldots\\}",
    depends_on: ["set"]
  },
  {
    id: "natural_numbers", name: "Natural Numbers",
    definition: "Natural numbers are the set of all positive integers starting from 1 and extending to infinity.",
    latex: "\\mathbb{N} = \\{1, 2, 3, \\ldots\\}",
    depends_on: ["set"]
  },
    {
    id: "empty_set", name: "Empty Set",
    definition: "The set that contains no elements.",
    latex: "\\emptyset",
    depends_on: ["set"]
  },
  {
    id: "zero", name: "Zero",
    definition: "The quantity representing the absence of any value or magnitude.",
    latex: "0",
    depends_on: ["empty_set"]
  },
  {
    id: "infinity", name: "Infinity",
    definition: "A quantity that is boundless or endless, exceeding any real number.",
    latex: "\\infty",
    depends_on: ["set"]
  },
  {
    id: "even_odd", name: "Even and Odd Numbers",
    definition: "Even numbers are integers divisible by 2, while odd numbers are integers that are not divisible by 2.",
    latex: "\\text{Even: } 2k, \\quad \\text{Odd: } 2k + 1, \\\\ k \\in \\mathbb{Z}",
    depends_on: ["integers", "divisibility"]
  },
  {
    id: "infintesimal", name: "Infinitesimal",
    definition: "A quantity that is infinitely small, approaching zero but never actually reaching it.",
    latex: "\\epsilon \\to 0",
    depends_on: ["infinity", "limits"]
  },
  {
  id: "absolute_value", name: "Absolute Value",
  definition: "The distance of a number from zero on the number line, always non-negative.",
  latex: "|a| = \\begin{cases} a & a \\geq 0 \\\\ -a & a < 0 \\end{cases}",
  depends_on: ["real_numbers", "subtraction"]
},
    {
    id: "arithmetic", name: "Arithmetic",
    definition: "The branch of mathematics dealing with the properties and manipulation of numbers. Numbers can be combined and separated.",
    latex: "a + b = c",
    depends_on: ["whole_numbers", "integers", "natural_numbers", "empty_set"]
  },
  {
    id: "ftar", name: "Fundamental Theorem of Arithmetic",
    definition: "Every integer greater than 1 can be uniquely represented as a product of prime numbers. This is also known as the unique factorization theorem.",
    latex: "n = p_1^{e_1} p_2^{e_2} \\cdots p_k^{e_k}",
    depends_on: ["arithmetic", "integers", "prime_numbers"]
  },
    {
    id: "addition", name: "Addition",
    definition: "The operation of combining two numbers to produce a sum.",
    latex: "a + b = c",
    depends_on: ["arithmetic"]
  },
      {
    id: "subtraction", name: "Subtraction",
    definition: "The operation of removing one number from another to produce a difference.",
    latex: "a - b = c",
    depends_on: ["addition"]
  },
        {
    id: "multiplication", name: "Multiplication",
    definition: "The operation of adding a number a b times to produce a product.",
    latex: "a \\times b = c",
    depends_on: ["arithmetic"]
  },
      {
    id: "addition_commutative", name: "Commutative Property of Addition",
    definition: "The order of addends does not change the sum.",
    latex: "a + b = b + a",
    depends_on: ["addition"]
  },
      {
    id: "addition_associative", name: "Associative Property of Addition",
    definition: "The way addends are grouped does not change the sum.",
    latex: "(a + b) + c = a + (b + c)",
    depends_on: ["addition"]
  },
      {
    id: "addition_identity", name: "Identity Property of Addition",
    definition: "The sum of any number and zero is the number itself.",
    latex: "a + 0 = a",
    depends_on: ["addition"]
  },
{
    id: "addition_inverse", name: "Inverse Property of Addition",
    definition: "The sum of any number and its additive inverse is zero.",
    latex: "a + (-a) = 0",
    depends_on: ["addition"]
  },
    {
    id: "multiplication_commutative", name: "Commutative Property of Multiplication",
    definition: "The order of factors does not change the product.",
    latex: "a \\times b = b \\times a",
    depends_on: ["multiplication"]
  },
      {
    id: "multiplication_zero", name: " Zero Property of Multiplication",
    definition: "The product of any number and zero is always zero.",
    latex: "a \\times 0 = 0",
    depends_on: ["multiplication"]
  },
        {
    id: "multiplication_associative", name: "Associative Property of Multiplication",
    definition: "The way factors are grouped does not change the product.",
    latex: "(a \\times b) \\times c = a \\times (b \\times c)",
    depends_on: ["multiplication"]
  },
{
    id: "multiplication_distributive", name: "Distributive Property of Multiplication",
    definition: "Multiplication distributes over addition.",
    latex: "a \\times (b + c) = a \\times b + a \\times c",
    depends_on: ["multiplication"]
  },
    {
    id: "multiplication_identity", name: "Identity Property of Multiplication",
    definition: "The product of any number and one is the number itself.",
    latex: "a \\times 1 = a",
    depends_on: ["multiplication"]
  },
    {
    id: "multiplication_inverse", name: "Inverse Property of Multiplication",
    definition: "The product of any number and its multiplicative inverse is one.",
    latex: "a \\times \\frac{1}{a} = 1",
    depends_on: ["multiplication"]
  },
  {
    id: "factorial", name: "Factorial",
    definition: "The product of all positive integers less than or equal to a given number.",
    latex: "n! = n \\times (n-1) \\times (n-2) \\times \\ldots \\times 1",
    depends_on: ["multiplication"]
  },
  {
    id: "exponentiation", name: "Exponentiation",
    definition: "The operation of multiplying a number a by itself n times to produce a power.",
    latex: "a^n = \\underbrace{a \\times a \\times \\ldots \\times a}_{n \\text{ times}}",
    depends_on: ["multiplication"]
  },
  {
    id: "product_of_powers", name: "Product of Powers",
    definition: "When multiplying powers with the same base, add the exponents.",
    latex: "a^m \\times a^n = a^{m+n}",
    depends_on: ["exponentiation"]
  },
  {
    id: "quotient_of_powers", name: "Quotient of Powers",
    definition: "When dividing powers with the same base, subtract the exponents.",
    latex: "\\frac{a^m}{a^n} = a^{m-n}",
    depends_on: ["exponentiation"]
  },
  {
    id: "power_of_powers", name: "Power of Powers",
    definition: "When raising a power to another power, multiply the exponents.",
    latex: "(a^m)^n = a^{mn}",
    depends_on: ["exponentiation"]
  },
   {
    id: "power_of_product", name: "Power of Product",
    definition: "When raising a product to a power, raise each factor to that power.",
    latex: "(ab)^n = a^n b^n",
    depends_on: ["exponentiation"]
  },
  {
    id: "one_exponent", name: "One Exponent",
    definition: "Any number raised to the power of one is the number itself.",
    latex: "a^1 = a",
    depends_on: ["exponentiation"]
  },
  {
    id: "zero_exponent", name: "Zero Exponent",
    definition: "Any non-zero number raised to the power of zero is one.",
    latex: "a^0 = 1, \\quad a \\neq 0",
    depends_on: ["exponentiation"]
  },
  {
    id: "power_of_quotient", name: "Power of Quotient",
    definition: "When raising a quotient to a power, raise both the numerator and denominator to that power.",
    latex: "\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}",
    depends_on: ["exponentiation"]
  },
  {
  id: "exponential_function", name: "Exponential Function",
  definition: "A function where a constant base is raised to a variable exponent.",
  latex: "f(x) = b^x,\\quad b > 0,\\, b \\neq 1",
  depends_on: ["functions", "exponentiation"],
  hasRichContent: true
},
{
  id: "exponential_power", name: "Exponential Power Function",
  definition: "A function where a variable base is raised to a variable exponent.",
  latex: "f(x) = x^x,\\quad x > 0",
  depends_on: ["functions", "exponentiation"],
  hasRichContent: true
},
{
    id: "scientific_notation", name: "Scientific Notation",
    definition: "A way of writing very large or very small numbers by multiplying a number between 1 and 10 by a power of ten.",
    latex: "a \\times 10^n, \\quad 1 \\leq |a| < 10, \\\\ n \\in \\mathbb{Z}",
    depends_on: ["exponentiation", "multiplication"]
  },
  {
    id: "e_notation", name: "Scientific E Notation",
    definition: "A shorthand for scientific notation commonly used in programming and engineering, where 'e' stands for 'exponent' and represents the power of ten.",
    latex: "a \\text{E} \\pm b = a \\times 10^{\\pm b}",
    depends_on: ["scientific_notation"]
  },
{
    id: "binomial_coefficient", name: "Binomial Coefficient",
    definition: "The number of ways to choose a subset of k items from a set of n distinct items. Known as 'n choose k'.",
    latex: "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}",
    depends_on: ["subset", "factorial"]
  },
{
    id: "binomial_theorem", name: "Binomial Theorem",
    definition: "A formula for expanding powers of a binomial expression.",
    latex: "(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k",
    depends_on: ["exponentiation", "binomial_coefficient", "power_of_product"]
  },
{
  id: "eulers_number", name: "Euler's Number",
  definition: "The unique positive real number e such that the derivative of e^x is itself. It is the base of the natural logarithm.",
  latex: "e = \\lim_{n \\to \\infty}\\left(1 + \\frac{1}{n}\\right)^n \\approx 2.718\\ldots",
  depends_on: ["limits", "exponential_function"]
},
  {
    id: "radicals", name: "Radicals",
    definition: "The operation of finding a number that, when multiplied by itself n times, produces a given value.",
    latex: "\\sqrt[n]{a} = b \\Longleftrightarrow  b^n = a",
    depends_on: ["exponentiation", "fractional_exponents"]
  },
  {
    id: "logarithms", name: "Logarithms",
    definition: "The operation of finding the exponent to which a base must be raised to produce a given value.",
    latex: "\\log_b(a) = c \\iff a = b^c",
    depends_on: ["exponentiation", "fractional_exponents", "inverse_functions"]
  },
  {
  id: "natural_log", name: "Natural Logarithm",
  definition: "The logarithm with base e.",
  latex: "\\ln(x) = \\log_e(x)",
  depends_on: ["logarithms", "eulers_number"]
},
  {
    id: "fractional_exponents", name: "Fractional Exponents",
    definition: "A fractional exponent represents a root operation.",
    latex: "a^{\\frac{m}{n}} = \\sqrt[n]{a^m}",
    depends_on: ["exponentiation"]
  },
  {
    id: "negative_exponents", name: "Negative Exponents",
    definition: "A negative exponent represents the reciprocal of the base raised to the positive exponent.",
    latex: "a^{-n} = \\frac{1}{a^n}",
    depends_on: ["exponentiation", "reciprocal"]
  },
{
    id: "division", name: "Division",
    definition: "The operation of distributing a number a into b equal parts, with each part being of quantity c.",
    latex: "a \\div b = c",
    depends_on: ["multiplication"]
  },
  {
    id: "remainder", name: "Remainder",
    definition: "The amount left over after dividing one number by another when the division is not exact.",
    latex: "a \\div b = q + r, \\quad 0 \\leq r < b",
    depends_on: ["division"]
  },
  {
    id: "long_division", name: "Long Division",
    definition: "A method for performing division of two numbers, especially when the divisor is larger than the dividend or when the division is not exact.",
    latex: "a \\div b = q + \\frac{r}{b}",
    depends_on: ["division", "remainder"]
  },
  {
  id: "divisibility", name: "Divisibility",
  definition: "An integer a is divisible by b if there exists an integer k such that a = bk, leaving no remainder.",
  latex: "b \\mid a \\iff \\exists\\, k \\in \\mathbb{Z} : a = bk",
  depends_on: ["integers", "division", "remainder"]
},
{
    id: "reciprocal", name: "Reciprocal",
    definition: "The multiplicative inverse of a number, such that the product of the number and its reciprocal is one.",
    latex: "a \\implies \\frac{1}{a}",
    depends_on: ["division", "multiplication"]
  },
{
  id: "prime_numbers", name: "Prime Numbers",
  definition: "A natural number greater than 1 whose only divisors are 1 and itself.",
  latex: "\\gcd(a, b) = \\\\ \\max\\{d \\in \\mathbb{Z}^+ : d \\mid a \\land d \\mid b\\}",
  depends_on: ["natural_numbers", "divisibility"]
},
{
  id: "gcd", name: "Greatest Common Divisor",
  definition: "The largest positive integer that divides two or more integers without a remainder.",
  latex: "\\gcd(a, b) = \\max\\{d \\in \\mathbb{Z}^+ : d \\mid a \\text{ and } d \\mid b\\}",
  depends_on: ["natural_numbers", "divisibility"]
},
{
  id: "modular_arithmetic", name: "Modular Arithmetic",
  definition: "A system of arithmetic where numbers wrap around after reaching a fixed modulus.",
  latex: "a \\equiv b \\pmod{n} \\iff \\\\ n \\mid (a - b)",
  depends_on: ["divisibility", "integers", "remainder"]
},
  {
    id: "rational_numbers", name: "Rational Numbers",
    definition: "Numbers that can be expressed as the quotient or fraction p/q of two integers, with the denominator q not equal to zero.",
    latex: "\\frac{p}{q}, \\quad p, q \\in \\mathbb{Z}, q \\neq 0",
    depends_on: ["division", "set"]
  },
  {
    id: "irrational_numbers", name: "Irrational Numbers",
    definition: "Numbers that cannot be expressed as the quotient of two integers.",
    latex: "\\mathbb{R} \\setminus \\mathbb{Q}",
    depends_on: ["rational_numbers", "set"]
  },
    {
    id: "division_by_zero", name: "Division by Zero",
    definition: "Division by zero is undefined in the set of real numbers.",
    latex: "\\frac{p}{0} = \\text{DNE}, \\quad p \\in \\mathbb{Z}, p \\neq 0",
    depends_on: ["division"]
  },
  {
      id: "real_numbers", name: "Real Numbers",
    definition: "All rational and irrational numbers.",
    latex: "\\mathbb{R} = \\{ \\sqrt{2}, \\pi, e, \\ldots \\}",
    depends_on: ["rational_numbers", "set"]
  },
    {
      id: "imaginary_numbers", name: "Imaginary Numbers",
    definition: "Numbers that are multiples of the imaginary unit i, which respresents the square root of -1.",
    latex: "\\mathbb{I} = \\{ ai \\mid a \\in \\mathbb{R}, i^2 = -1 \\}",
    depends_on: ["real_numbers", "radicals"]
  },
  {
      id: "complex_numbers", name: "Complex Numbers",
    definition: "A value than is formed with the sum of a real number and an imaginary number.",
    latex: "\\mathbb{C} = \\{ a + bi \\mid a, b \\in \\mathbb{R} \\}",
    depends_on: ["real_numbers", "imaginary_numbers"]
  },
  {
      id: "number_line", name: "Number Line",
    definition: "A representation of the set of real numbers, structured as a one-dimensional, straight Euclidean line, extending infinitely in both directions.",
    latex: "\\mathbb{R}",
    depends_on: ["real_numbers", "line"]
  },
    {
    id: "algebra", name: "Algebra",
    definition: "The branch of mathematics that uses symbols and letters to represent unknown numbers and quantities in formulas and equations.",
    latex: "x + a = y \\implies x = y - a",
    depends_on: ["arithmetic"]
  },
  {
    id: "variable", name: "Variables",
    definition: "A symbol that represents an unknown or changeable number.",
    latex: "x, y, z, \\ldots",
    depends_on: ["algebra"]
  },
  {
    id: "coefficient", name: "Coefficients",
    definition: "A constant multiplier in a term of a polynomial.",
    latex: "a, b, c, \\ldots",
    depends_on: ["polynomial", "variable"]
  },
  {
    id: "equality", name: "Equality",
    definition: "A relationship between two expressions that have the same value.",
    latex: "x = y",
    depends_on: ["algebra", "law_of_identity"]
  },
  {
    id: "inequality", name: "Inequality",
    definition: "A mathematical statement that compares two expressions using greater than, less than, or their inclusive variants.",
    latex: "a < b,\\quad a \\leq b,\\\\ \\quad a > b,\\quad a \\geq b",
    depends_on: ["equality"]
  },
  {
    id: "functions", name: "Functions",
    definition: "A relation that uniquely maps each element of a domain to exactly one element of a codomain.",
    latex: "f: A \\to B,\\quad f(x) = y",
    depends_on: ["algebra", "variable"]
  },
  {
    id: "even_odd_functions", name: "Even and Odd Functions",
    definition: "Even functions are symmetric with respect to the y-axis, while odd functions are symmetric with respect to the origin.",
    latex: "\\text{Even: } f(-x) = f(x), \\\\ \\text{Odd: } f(-x) = -f(x)",
    depends_on: ["functions", "cartesian_plane"]
  },
  {
    id: "implicit_functions", name: "Implicit Functions",
    definition: "A function defined by an equation that does not explicitly solve for one variable in terms of the other.",
    latex: "F(x, y) = 0",
    depends_on: ["functions"]
  },
  {
    id: "real_solutions", name: "Real Solutions",
    definition: "The set of all real numbers that satisfy a given equation or inequality.",
    latex: "\\{ x \\in \\mathbb{R} : f(x) = 0 \\}",
    depends_on: ["algebra", "variable", "functions", "real_numbers"]
  },
  {
    id: "roots", name: "Roots",
    definition: "The set of all real numbers that, when substituted into a polynomial, yield zero.",
    latex: "\\{ x \\in \\mathbb{R} : f(x) = 0 \\}",
    depends_on: ["real_solutions", "polynomial"]
  },
  {
    id: "zeros", name: "Zeros",
    definition: "The set of all real numbers for which a function equals zero.",
    latex: "\\{ x \\in \\mathbb{R} : f(x) = 0 \\}",
    depends_on: ["real_solutions", "cartesian_plane"]
  },
  {
    id: "inverse_functions", name: "Inverse Functions",
    definition: "A relation that uniquely maps each element of a range to exactly one element of the domain of the original function.",
    latex: "f^{-1}(y) = x \\iff f(x) = y",
    depends_on: ["functions", "domain", "range"]
  },
  {
    id: "injective-functions", name: "Injective Functions",
    definition: "A function where each element of the domain maps to a unique element of the codomain, and vice versa. Also referred to as a one-to-one function.",
    latex: "\\forall x_1, x_2 \\in A, f(x_1) = f(x_2) \\\\ \\implies x_1 = x_2",
    depends_on: ["functions"]
  },
  {
    id: "domain", name: "Domain",
    definition: "The set of all possible input values for a function.",
    latex: "A \\subseteq \\mathbb{R}",
    depends_on: ["functions"]
  },
  {
    id: "range", name: "Range",
    definition: "The codomain, or the set of all possible output values for a function.",
    latex: "B \\subseteq \\mathbb{R}",
    depends_on: ["functions"]
  },
  {
    id: "asymptote", name: "Asymptote",
    definition: "A line that a curve approaches as the independent variable tends towards a limit. Occurs when the function grows without bound or approaches a finite value.",
    latex: "x = a, y = b, y = mx + b",
    depends_on: ["functions", "line","limits", "cartesian_plane"]
  },
  {
    id: "vertical_asymptote", name: "Vertical Asymptote",
    definition: "An asymptote that occurs when the function is undefined at a certain value of the independent variable, and the function approaches infinity or negative infinity as it approaches that value.",
    latex: "\\lim_{x \\to a} f(x) = \\pm \\infty",
    depends_on: ["asymptote"]
  },
  {
    id: "horizontal_asymptote", name: "Horizontal Asymptote",
    definition: "An asymptote that occurs when the function approaches a finite value as the independent variable tends towards infinity or negative infinity.",
    latex: "\\lim_{x \\to \\pm \\infty} f(x) = L",
    depends_on: ["asymptote"]
  },
  {
    id: "slant_asymptote", name: "Slant Asymptote",
    definition: "An asymptote that occurs when the function approaches a linear function as the independent variable tends towards infinity or negative infinity. Occurs when the degree of the numerator is exactly one higher than the degree of the denominator; also called an oblique asymptote.",
    latex: "\\lim_{x \\to \\pm \\infty} \\left( f(x) - (mx + b) \\right) = 0",
    depends_on: ["asymptote"]
  },
  {
    id: "hole", name: "Hole",
    definition: "A point where the function is undefined but the limit exists. Occurs when a factor in the numerator and denominator cancels out.",
    latex: "\\lim_{x \\to a} f(x) = L \\land f(a) = \\text{DNE}",
    depends_on: ["functions", "limits", "rational_function"]
  },
  {
  id: "polynomial", name: "Polynomials",
  definition: "An expression consisting of variables and coefficients combined using addition, subtraction, and non-negative integer exponents.",
  latex: "P(x) = a_n x^n + a_{n-1}x^{n-1} + \\cdots + a_1 x + a_0",
  depends_on: ["variable", "exponentiation", "addition", "multiplication"]
},
{
  id: "rational_function", name: "Rational Function",
  definition: "A function that is the ratio of two polynomials.",
  latex: "f(x) = \\frac{P(x)}{Q(x)}",
  depends_on: ["polynomial", "division"]
},
{
  id: "pfd", name: "Partial Fraction Decomposition",
  definition: "A technique for decomposing a rational function into simpler fractions.",
  latex: "f(x) = \\frac{P(x)}{Q(x)} = \\sum \\frac{A_i}{(x - r_i)^{m_i}}",
  depends_on: ["rational_function", "polynomial", "roots"]
},
{
  id: "fta", name: "Fundamental Theorem of Algebra",
  definition: "Every non-constant polynomial with complex coefficients has at least one complex root. . A key consequence is that a polynomial of degree n has exactly n roots in the complex number system, provided that roots are counted with their multiplicities.",
  latex: "\\forall P(x) \\in \\mathbb{C}[x], \\\\ \\exists z \\in \\mathbb{C} : P(z) = 0",
  depends_on: ["polynomial", "complex_numbers", "coefficient", "roots"]
},
{
  id: "monomial", name: "Monomials",
  definition: "A polynomial with only one term.",
  latex: "ax^n",
  depends_on: ["polynomial"]
},
{
  id: "binomial", name: "Binomials",
  definition: "A polynomial with two terms.",
  latex: "(ax + b)",
  depends_on: ["polynomial"]
},
{
  id: "trinomial", name: "Trinomials",
  definition: "A polynomial with three terms.",
  latex: "ax^2 + bx + c",
  depends_on: ["polynomial"]
},
{
  id: "conjugate", name: "Conjugates",
  definition: "A pair of binomials with the same terms but opposite signs between them.",
  latex: "(a + b)(a - b)",
  depends_on: ["binomial"]
},
{
  id: "linear_equation", name: "Linear Equation",
  definition: "An equation whose solutions form a straight line when graphed, with no variable raised to a power greater than one.",
  latex: "ax + b = 0 \\implies x = -\\frac{b}{a}",
  depends_on: ["line", "polynomial"]
},
{
  id: "quadratic_equation", name: "Quadratic Equation",
  definition: "A polynomial equation of degree two.",
  latex: "ax^2 + bx + c = 0",
  depends_on: ["polynomial"]
},
{
  id: "completing_the_square", name: "Completing the Square",
  definition: "A method for solving quadratic equations by transforming the equation into a perfect square trinomial.",
  latex: "ax^2 + bx + c = 0 \\implies \\\\ (x + p)^2 = q",
  depends_on: ["quadratic_equation", "trinomial"]
},
{
  id: "quadratic_formula", name: "Quadratic Formula",
  definition: "The formula that gives the roots of any quadratic equation. Derived by completing the square on the general form of a quadratic equation.",
  latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  depends_on: ["quadratic_equation", "radicals", "completing_the_square"]
},
  {
    id: "cartesian_plane", name: "Cartesian Plane",
    definition: "A coordinate system that allows us to plot points and visualize functions on a two-dimensional space with a x and y axis.",
    latex: "\\mathbb{R}^2",
    depends_on: ["functions"]
  },
   {
    id: "point", name: "Point",
    definition: "A location in space, represented by numerical coordinates in the Cartesian plane that represnt a distance from zero on each axis.",
    latex: "(x, y)",
    depends_on: ["cartesian_plane", "functions"]
  },
  {
    id: "line", name: "Line",
    definition: "A straight path that extends between two points or towards positive or negative infinity.",
    latex: "y = mx + b",
    depends_on: ["cartesian_plane", "point"]
  },
  {
    id: "curve", name: "Curve",
    definition: "A path that is not straight, often described by a mathematical function or between two points.",
    latex: "\\text{Curve}: y = f(x)",
    depends_on: ["cartesian_plane", "point"]
  },
  {
    id: "tangent_line", name: "Tangent Line",
    definition: "A line that touches a curve at a single point and has the same slope as the curve at that point.",
    latex: " y - f(a) = f'(a)(x - a)",
    depends_on: ["line", "curve", "derivative"]
  },
  {
    id: "shape", name: "Shape",
    definition: "A geometric figure defined by its boundaries of connected lines, curves, or points.",
    latex: "\\text{Shape}",
    depends_on: ["line", "point", "curve"]
  },
  {
    id: "geometry", name: "Geometry",
    definition: "The branch of mathematics concerned with the properties and relations of points, lines, surfaces, and solids.",
    latex: "\\text{Shape}",
    depends_on: ["line", "point", "curve", "cartesian_plane", "shape"]
  },
  {
  id: "angle", name: "Angle",
  definition: "The measure of rotation between two rays sharing a common endpoint, measured in degrees or radians.",
  latex: "\\theta",
  depends_on: ["geometry"]
},
{
  id: "radians", name: "Radians",
  definition: "A unit of angular measure equal to the angle subtended at the center of a circle by an arc equal in length to the radius.",
  latex: "\\theta_{\\text{rad}} = \\frac{s}{r},\\quad 2\\pi\\text{ rad} = 360^\\circ",
  depends_on: ["circle", "angle", "degrees", "pi"]
},
{
  id: "degrees", name: "Degrees",
  definition: "A unit of angular measure equal to one-three-hundred-and-sixtieth of a full rotation.",
  latex: "\\theta_{\\text{deg}} = \\frac{360^\\circ}{2\\pi} \\cdot \\theta_{\\text{rad}}",
  depends_on: ["angle"]
},

  {
    id: "polygon", name: "Polygon",
    definition: "A closed two-dimensional shape with at least three straight sides.",
    latex: "\\text{Polygon}",
    depends_on: ["shape"]
  },
  {
    id: "sum_of_angles", name: "Sum of Angles",
    definition: "The sum of the interior angles of a polygon with n sides is (n - 2) × 180°.",
    latex: "\\sum_{i=1}^n \\theta_i = (n - 2) \\times 180^\\circ",
    depends_on: ["polygon", "angle"]
  },
  {
    id: "triangle", name: "Triangle",
    definition: "A polygon with three edges and three vertices.",
    latex: "\\triangle",
    depends_on: ["polygon"],
    hasRichContent: true
  },
  {
    id: "right_triangle", name: "Right Triangle",
    definition: "A triangle with one 90-degree angle.",
    latex: "\\triangle_{\\text{right}}",
    depends_on: ["triangle"]
  },
  {
    id: "trigonometry", name: "Trigonometry",
    definition: "The study of relationships between the sides and angles of triangles.",
    latex: "\\text{Trigonometry}",
    depends_on: ["triangle", "angle"]
  },
  {
    id: "pythagorean_theorem", name: "Pythagorean Theorem",
    definition: "In a right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.",
    latex: "a^2 + b^2 = c^2",
    depends_on: ["triangle"]
  },
  {
    id: "rectangle", name: "Rectangle",
    definition: "A polygon with four edges and four vertices.",
    latex: "\\square",
    depends_on: ["polygon"]
  },
  {
    id: "square", name: "Square",
    definition: "A rectangle with four equal sides and four right angles.",
    latex: "\\square",
    depends_on: ["rectangle"]
  },
  {
    id: "circle", name: "Circle",
    definition: "A set of all points in a plane that are equidistant from a fixed point.",
    latex: "(x - h)^2 + (y - k)^2 = r^2",
    depends_on: ["elipse", "shape"]
  },
  {
    id: "circumference", name: "Circumference",
    definition: "The distance around the edge of a circle.",
    latex: "C = 2\\pi r",
    depends_on: ["circle"]
  },
  {
    id: "radius", name: "Radius",
    definition: "The distance from the center of a circle to any point on its edge.",
    latex: "r",
    depends_on: ["circle"]
  },
  {
    id: "diameter", name: "Diameter",
    definition: "The distance across a circle through its center.",
    latex: "d = 2r",
    depends_on: ["circle", "radius"]
  },
  {
  id: "unit_circle", name: "Unit Circle",
  definition: "A circle of radius 1 centered at the origin, used to define trigonometric functions for all real angles.",
  latex: "x^2 + y^2 = 1",
  depends_on: ["circle", "cartesian_plane"]
},
{
  id: "pi", name: "Pi",
  definition: "The ratio of a circle's circumference to its diameter.",
  latex: "\\pi = \\frac{C}{d} \\approx 3.14159\\ldots",
  depends_on: ["circle", "circumference", "diameter"]
},
{
    id: "elipse", name: "Ellipse",
    definition: "A set of all points in a plane, the sum of whose distances from two fixed points is constant.",
    latex: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1",
    depends_on: ["shape"]
  },
{
    id: "hyperbola", name: "Hyperbola",
    definition: "A set of all points in a plane, the difference of whose distances from two fixed points is constant.",
    latex: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1",
    depends_on: ["elipse", "shape"]
  },
{
  id: "parabola", name: "Parabola",
  definition: "A set of all points in a plane that are equidistant from a fixed point and a fixed line.",
  latex: "y^2 = 4px",
  depends_on: ["quadratic_equation", "shape"]
},
{
  id: "conic_section", name: "Conic Section",
  definition: "A curve obtained by the intersection of a plane with a double-napped cone.",
  latex: "\\text{Conic Section}",
  depends_on: ["elipse", "circle", "hyperbola", "parabola"]
},
{
  id: "sine", name: "Sine", field: "trigonometry",
  definition: "Fundamental trigonometric function defined as the y- and x-coordinates of a point on the unit circle at angle θ. In a right triangle, it is the ratio of the length of the side opposite the angle to the length of the hypotenuse.",
  latex: "\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}} = y",
  depends_on: ["unit_circle", "trigonometry"]
},
{
  id: "cosine", name: "Cosine", field: "trigonometry",
  definition: "Fundamental trigonometric function defined as the x-coordinate of a point on the unit circle at angle θ. In a right triangle, it is the ratio of the length of the side adjacent to the angle to the length of the hypotenuse.",
  latex: "\\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}} = x",
  depends_on: ["unit_circle", "trigonometry"]
},
{
  id: "tangent", name: "Tangent",
  definition: "Fundamental trigonometric function defined as the ratio of the y-coordinate to the x-coordinate of a point on the unit circle at angle θ. In a right triangle, it is the ratio of the length of the side opposite the angle to the length of the side adjacent to the angle.",
  latex: "\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = \\frac{y}{x}",
  depends_on: ["sine", "cosine", "division"]
},
{
  id: "cosecant", name: "Cosecant",
  definition: "Trigonometric function defined as the reciprocal of the sine function.",
  latex: "\\csc\\theta = \\frac{1}{\\sin\\theta} = \\frac{\\text{hypotenuse}}{\\text{opposite}}",
  depends_on: ["sine", "reciprocal"]
},
{
  id: "secant", name: "Secant",
  definition: "Trigonometric function defined as the reciprocal of the cosine function.",
  latex: "\\sec\\theta = \\frac{1}{\\cos\\theta} = \\frac{\\text{hypotenuse}}{\\text{adjacent}}",
  depends_on: ["cosine", "reciprocal"]
},
{
  id: "cotangent", name: "Cotangent",
  definition: "Trigonometric function defined as the reciprocal of the tangent function.",
  latex: "\\cot\\theta = \\frac{1}{\\tan\\theta} = \\frac{\\cos\\theta}{\\sin\\theta}",
  depends_on: ["sine", "cosine", "tangent", "reciprocal"]
},
{
  id: "arcsine", name: "Arcsine",
  definition: "The inverse of the sine function, defined as the angle whose sine is a given value.",
  latex: "\\sin^{-1}(x) = \\theta \\iff \\sin(\\theta) = x",
  depends_on: ["sine", "inverse_functions"]
},
{
  id: "arccosine", name: "Arccosine",
  definition: "The inverse of the cosine function, defined as the angle whose cosine is a given value.",
  latex: "\\cos^{-1}(x) = \\theta \\iff \\cos(\\theta) = x",
  depends_on: ["cosine", "inverse_functions"]
},
{
  id: "arctangent", name: "Arctangent",
  definition: "The inverse of the tangent function, defined as the angle whose tangent is a given value.",
  latex: "\\tan^{-1}(x) = \\theta \\iff \\tan(\\theta) = x",
  depends_on: ["tangent", "inverse_functions"]
},
{
  id: "arccotangent", name: "Arccotangent",
  definition: "The inverse of the cotangent function, defined as the angle whose cotangent is a given value.",
  latex: "\\cot^{-1}(x) = \\theta \\iff \\cot(\\theta) = x",
  depends_on: ["cotangent", "inverse_functions"]
},
{
  id: "arccosecant", name: "Arccosecant",
  definition: "The inverse of the cosecant function, defined as the angle whose cosecant is a given value.",
  latex: "\\csc^{-1}(x) = \\theta \\iff \\csc(\\theta) = x",
  depends_on: ["cosecant", "inverse_functions"]
},
{
  id: "arcsecant", name: "Arcsecant",
  definition: "The inverse of the secant function, defined as the angle whose secant is a given value.",
  latex: "\\sec^{-1}(x) = \\theta \\iff \\sec(\\theta) = x",
  depends_on: ["secant", "inverse_functions"]
},
{
  id: "hyperbolic_sine", name: "Hyperbolic Sine",
  definition: "A function defined based on the hyperbola rather than the unit circle. It can be expressed in terms of the exponential function.",
  latex: "\\sinh(x) = \\frac{e^x - e^{-x}}{2}",
  depends_on: ["exponential_function", "eulers_number", "sine", "hyperbola"]
},
{
  id: "hyperbolic_cosine", name: "Hyperbolic Cosine",
  definition: "A function defined based on the hyperbola rather than the unit circle. It can be expressed in terms of the exponential function.",
  latex: "\\cosh(x) = \\frac{e^x + e^{-x}}{2}",
  depends_on: ["exponential_function", "eulers_number", "cosine", "hyperbola"],
},
{
  id: "hyperbolic_tangent", name: "Hyperbolic Tangent",
  definition: "A function defined as the ratio of the hyperbolic sine to the hyperbolic cosine, or equivalently as the difference of the exponential functions over their sum.",
  latex: "\\tanh(x) = \\frac{\\sinh(x)}{\\cosh(x)}",
  depends_on: ["hyperbolic_sine", "hyperbolic_cosine"]
},
{
  id: "hyperbolic_cotangent", name: "Hyperbolic Cotangent",
  definition: "A function defined as the ratio of the hyperbolic cosine to the hyperbolic sine, or equivalently as the reciprocal of the hyperbolic tangent.",
  latex: "\\coth(x) = \\frac{\\cosh(x)}{\\sinh(x)}",
  depends_on: ["hyperbolic_sine", "hyperbolic_cosine", "hyperbolic_tangent", "reciprocal"]
},
{
  id: "hyperbolic_cosecant", name: "Hyperbolic Cosecant",
  definition: "A function defined as the reciprocal of the hyperbolic sine.",
  latex: "\\text{csch}(x) = \\frac{1}{\\sinh(x)}",
  depends_on: ["hyperbolic_sine", "reciprocal"]
},
{
  id: "hyperbolic_secant", name: "Hyperbolic Secant",
  definition: "A function defined as the reciprocal of the hyperbolic cosine.",
  latex: "\\text{sech}(x) = \\frac{1}{\\cosh(x)}",
  depends_on: ["hyperbolic_cosine", "reciprocal"]
},
{
  id: "arc-hyperbolic_sine", name: "Arc Hyperbolic Sine",
  definition: "The inverse of the hyperbolic sine function.",
  latex: "\\sinh^{-1}(x) = \\theta \\iff \\\\ \\sinh(\\theta) = x",
  depends_on: ["hyperbolic_sine", "inverse_functions"]
},
{
  id: "arc-hyperbolic_cosine", name: "Arc Hyperbolic Cosine",
  definition: "The inverse of the hyperbolic cosine function.",
  latex: "\\cosh^{-1}(x) = \\theta \\iff \\\\ \\cosh(\\theta) = x",
  depends_on: ["hyperbolic_cosine", "inverse_functions"]
},
{
  id: "arc-hyperbolic_tangent", name: "Arc Hyperbolic Tangent",
  definition: "The inverse of the hyperbolic tangent function.",
  latex: "\\tanh^{-1}(x) = \\theta \\iff \\\\ \\tanh(\\theta) = x",
  depends_on: ["hyperbolic_tangent", "inverse_functions"]
},
{
  id: "arc-hyperbolic_cotangent", name: "Arc Hyperbolic Cotangent",
  definition: "The inverse of the hyperbolic cotangent function.",
  latex: "\\coth^{-1}(x) = \\theta \\iff \\\\ \\coth(\\theta) = x",
  depends_on: ["hyperbolic_cotangent", "inverse_functions"]
},
{
  id: "arc-hyperbolic_cosecant", name: "Arc Hyperbolic Cosecant",
  definition: "The inverse of the hyperbolic cosecant function.",
  latex: "\\text{csch}^{-1}(x) = \\theta \\iff \\\\ \\text{csch}(\\theta) = x",
  depends_on: ["hyperbolic_cosecant", "inverse_functions"]
},
{
  id: "arc-hyperbolic_secant", name: "Arc Hyperbolic Secant",
  definition: "The inverse of the hyperbolic secant function.",
  latex: "\\text{sech}^{-1}(x) = \\theta \\iff \\\\ \\text{sech}(\\theta) = x",
  depends_on: ["hyperbolic_secant", "inverse_functions"]
},
{
  id: "pythagorean_identity", name: "Pythagorean Identity",
  definition: "A fundamental trigonometric identity that relates the squares of sine and cosine of an angle to 1.",
  latex: "\\sin^2\\theta + \\cos^2\\theta = 1 \\\\ \\implies \\tan^2\\theta + 1 = \\sec^2\\theta \\\\ \\implies 1 + \\cot^2\\theta = \\csc^2\\theta",
  depends_on: ["sine", "cosine", "tangent", "secant", "cotangent", "cosecant", "pythagorean_theorem", "unit_circle"]
},
{
  id: "angle_sum_sine", name: "Angle Sum Identity for Sine",
  definition: "A trigonometric identity that expresses the sine of the sum of two angles in terms of the sines and cosines of the individual angles.",
  latex: "\\sin(\\alpha \\pm \\beta) = \\\\ \\sin\\alpha \\cos\\beta \\pm \\cos\\alpha \\sin\\beta",
  depends_on: ["sine", "cosine"]
},
{
  id: "angle_sum_cosine", name: "Angle Sum Identity for Cosine",
  definition: "A trigonometric identity that expresses the cosine of the sum of two angles in terms of the sines and cosines of the individual angles.",
  latex: "\\cos(\\alpha \\pm \\beta) = \\\\ \\cos\\alpha \\cos\\beta \\mp \\sin\\alpha \\sin\\beta",
  depends_on: ["sine", "cosine"]
},
{
  id: "angle_sum_tangent", name: "Angle Sum Identity for Tangent",
  definition: "A trigonometric identity that expresses the tangent of the sum of two angles in terms of the tangents of the individual angles.",
  latex: "\\tan(\\alpha \\pm \\beta) = \\frac{\\tan\\alpha \\pm \\tan\\beta}{1 \\mp \\tan\\alpha \\tan\\beta}",
  depends_on: ["tangent"]
},
{
  id: "double_angle_sine", name: "Double Angle Identity for Sine",
  definition: "A trigonometric identity that expresses the sine of twice an angle in terms of the sine and cosine of the angle.",
  latex: "\\sin(2\\theta) = 2\\sin\\theta \\cos\\theta",
  depends_on: ["sine", "cosine"]
},
{
  id: "double_angle_cosine", name: "Double Angle Identity for Cosine",
  definition: "A trigonometric identity that expresses the cosine of twice an angle in terms of the sine and cosine of the angle.",
  latex: "\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta \\\\ = 2\\cos^2\\theta - 1 \\\\ = 1 - 2\\sin^2\\theta ",
  depends_on: ["sine", "cosine"]
},
{
  id: "half_angle_sine", name: "Half Angle Identity for Sine",
  definition: "A trigonometric identity that expresses the sine of half an angle in terms of the cosine of the angle.",
  latex: "\\sin\\left(\\frac{\\theta}{2}\\right) = \\pm \\sqrt{\\frac{1 - \\cos\\theta}{2}}",
  depends_on: ["sine", "cosine"]
},
{
  id: "half_angle_cosine", name: "Half Angle Identity for Cosine",
  definition: "A trigonometric identity that expresses the cosine of half an angle in terms of the cosine of the angle.",
  latex: "\\cos\\left(\\frac{\\theta}{2}\\right) = \\pm \\sqrt{\\frac{1 + \\cos\\theta}{2}}",
  depends_on: ["sine", "cosine"]
},
{
  id: "product_sine", name: "Product-to-Sum Identity for Sine",
  definition: "A trigonometric identity that expresses the product of two sine functions as a sum of cosine functions.",
  latex: "\\sin\\alpha \\sin\\beta = \\\\ \\frac{1}{2}[\\cos(\\alpha - \\beta) - \\cos(\\alpha + \\beta)]",
  depends_on: ["sine", "cosine"]
},
{
  id: "product_cosine", name: "Product-to-Sum Identity for Cosine",
  definition: "A trigonometric identity that expresses the product of two cosine functions as a sum of cosine functions.",
  latex: "\\cos\\alpha \\cos\\beta = \\\\ \\frac{1}{2}[\\cos(\\alpha - \\beta) + \\cos(\\alpha + \\beta)]",
  depends_on: ["cosine"]
},
{
  id: "even_odd_sine", name: "Even and Odd Identity for Sine",
  definition: "A trigonometric identity that expresses the sine of an even function as zero and the sine of an odd function as itself.",
  latex: "\\sin(-\\theta) = -\\sin(\\theta)",
  depends_on: ["sine"]
},
{
  id: "even_odd_cosine", name: "Even and Odd Identity for Cosine",
  definition: "A trigonometric identity that expresses the cosine of an even function as itself and the cosine of an odd function as zero.",
  latex: "\\cos(-\\theta) = \\cos(\\theta)",
  depends_on: ["cosine"]
},
{
  id: "even_odd_tangent", name: "Even and Odd Identity for Tangent",
  definition: "A trigonometric identity that expresses the tangent of an even function as zero and the tangent of an odd function as itself.",
  latex: "\\tan(-\\theta) = -\\tan(\\theta)",
  depends_on: ["tangent"]
},
{
  id: "cofunction_sine", name: " Cofunction Identity for Sine",
  definition: "A trigonometric identity that expresses the sine of an angle as the cosine of its complement.",
  latex: "\\sin(\\theta) = \\cos\\left(\\frac{\\pi}{2} - \\theta\\right)",
  depends_on: ["sine", "cosine"]
},
{
  id: "cofunction_tangent", name: " Cofunction Identity for Tangent",
  definition: "A trigonometric identity that expresses the tangent of an angle as the cotangent of its complement.",
  latex: "\\tan(\\theta) = \\cot\\left(\\frac{\\pi}{2} - \\theta\\right)",
  depends_on: ["tangent", "cotangent"]
},
{
  id: "law_of_sines", name: "Law of Sines",
  definition: "A relationship between the sides and angles of any triangle, stating that the ratio of a side to the sine of its opposite angle is constant.",
  latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
  depends_on: ["sine", "triangle"]
},
{
  id: "law_of_cosines", name: "Law of Cosines",
  definition: "A generalization of the Pythagorean theorem relating the lengths of the sides of any triangle to the cosine of one of its angles.",
  latex: "c^2 = a^2 + b^2 - 2ab\\cos(C)",
  depends_on: ["cosine", "triangle"]
},
  {
    id: "slope", name: "Slope",
    definition: "The slope of a function is the ratio of the change in y to the change in x between any two points on the line.",
    latex: "m = \\frac{y_2 - y_1}{x_2 - x_1}",
    depends_on: ["functions", "cartesian_plane", "point", "line"]
  },
  {
    id: "distance_formula", name: "Distance Formula",
    definition: "The distance between two points on a coordinate plane can be found using the Pythagorean theorem.",
    latex: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
    depends_on: ["point", "cartesian_plane", "pythagorean_theorem"]
  },
  {
    id: "limits", name: "Limits",
    definition: "A limit formalizes the notion of a value that a function approaches as its argument gets arbitrarily close to a point.",
    latex: "\\lim_{x \\to a} f(x) = L",
    depends_on: ["functions", "infinity"]
  },
  {
    id: "sequences", name: "Sequences",
    definition: "An ordered list of numbers following a rule.",
    latex: "f(n) = a_1, a_2, \\ldots, a_{n-1}, a_n",
    depends_on: ["functions", ]
  },
    {
    id: "arithmetic_sequence", name: "Arithmetic Sequence",
    definition: "A sequence in which each term differs from the previous term by a constant.",
    latex: "a_n = a_1 + (n-1)d",
    depends_on: ["sequences"]
  },
  {
    id: "geometric_sequence", name: "Geometric Sequence",
    definition: "A sequence in which each term is obtained by multiplying the previous term by a constant.",
    latex: "a_n = a_1 \\cdot r^{n-1}",
    depends_on: ["sequences"]
  },

  {
    id: "growth_rate_sequences", name: "Growth Rate of Sequences Theorem",
    definition: "Orders functions by how quickly they approach infinity as n approaches infinity.",
    latex: "\\ln \\ll n^{p} \\ll b^{n} \\ll n! \\ll n^{n}",
    depends_on: ["sequences", "limits", "convergence", "divergence"]
  },
  {
    id: "series", name: "Series",
    definition: "The sum of a sequence's terms, converging when the partial sums approach a finite limit.",
    latex: "S = \\sum_{k=1}^{N} a_k",
    depends_on: ["sequences"]
  },
  {
    id: "geometric_series", name: "Geometric Series",
    definition: "The sum of the terms of a geometric sequence.",
    latex: "S = \\sum_{k=1}^{N} a_1 r^{k-1}",
    depends_on: ["geometric_sequence", "series"]
  },
  {
    id: "geometric_series_sum", name: "Geometric Series Sum",
    definition: "Provides a formula for the sum of the first N terms of a geometric series, valid for any common ratio r except 1.",
    latex: "S = \\sum_{k=1}^{N} a_1 r^{k-1} = a_1 \\frac{1 - r^N}{1 - r} \\\\ \\forall r \\neq 1",
    depends_on: ["geometric_series"]
  },
  {
    id: "geometric_series_infinite", name: "Infinite Geometric Series",
    definition: "The sum of the terms of a geometric sequence, converging when the common ratio is between -1 and 1.",
    latex: "S = \\sum_{k=1}^{\\infty} a_1 r^{k-1} = \\frac{a_1}{1 - r} \\\\ \\forall |r| < 1",
    depends_on: ["geometric_series", "convergence", "infinity"]
  },
  {
    id: "harmonic_series", name: "Harmonic Series",
    definition: "The sum of the reciprocals of the positive integers.",
    latex: "S = \\sum_{n=1}^{\\infty} \\frac{1}{n}",
    depends_on: ["series"]
  },
  {
    id: "divergence_test", name: "Divergence Test",
    definition: "A test for the divergence of a series.",
    latex: "\\lim_{n \\to \\infty} a_n \\neq 0 \\implies \\\\ \\sum_{n=1}^{\\infty} a_n \\text{ diverges}",
    depends_on: ["series", "divergence"]
  },
  {
    id: "partial_sums", name: "Partial Sums",
    definition: "The sum of the first n terms of a sequence.",
    latex: "S_n = \\sum_{i=1}^n a_i",
    depends_on: ["sequences", "pfd"]
  },
  {
    id: "continuity", name: "Continuity",
    definition: "A function is continuous at a point if its limit there equals its value — no gaps, jumps, or asymptotes at that point.",
    latex: "\\lim_{x \\to a} f(x) = f(a)",
    depends_on: ["limits"]
  },
  {
    id: "convergence", name: "Convergence",
    definition: "A sequence or series converges if it approaches a real value as the number of terms increases.",
    latex: "\\lim_{n \\to \\infty} a_n = L",
    depends_on: ["sequences", "series", "limits", "real_numbers"]
  },
  {
    id: "divergence", name: "Divergence",
    definition: "A sequence or series diverges if it does not approach a real value as the number of terms increases.",
    latex: "\\lim_{n \\to \\infty} a_n = \\pm \\infty \\vee \\text{ DNE}",
    depends_on: ["convergence"]
  },
  {
    id: "monotone_convergence", name: "Monotone Convergence",
    definition: "A bounded monotone sequence converges to a limit. Specifically, if a sequence is increasing and bounded above, it converges to its supremum; if it is decreasing and bounded below, it converges to its infimum.",
    latex: "\\lim_{n \\to \\infty} a_n = \\sup\\{a_n : n \\in \\mathbb{N}\\}",
    depends_on: ["convergence"]
  },
  {
    id: "oscillatory_convergence", name: "Oscillatory Convergence",
    definition: "A bounded sequence that oscillates but converges to a limit.",
    latex: "\\sum_{n=1}^\\infty \\frac{(-1)^n}{n} \\to 0",
    depends_on: ["convergence"]
  },
  {
    id: "riemann_sum", name: "Riemann Sum",
    definition: "A method for approximating the area under a curve by dividing it into primitive shapes and summing their areas.",
    latex: "\\sum_{i=1}^n f(x_i)\\Delta x",
    depends_on: ["limits", "functions"]
  },
  {
    id: "derivative", name: "Derivative",
    definition: "The derivative is the instantaneous rate of change — the slope of the tangent line to a curve at a given point.",
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    depends_on: ["limits", "continuity", "slope", "functions", "infintesimal"]
  },
  {
    id: "integral", name: "Integral",
    definition: "The integral accumulates infinitesimal contributions — geometrically the signed area under a curve over an interval.",
    latex: "\\int_a^b f(x)\\, dx = \\lim_{n\\to\\infty}\\sum_{i=1}^n f(x_i)\\Delta x",
    depends_on: ["limits", "continuity", "riemann_sum", "infintesimal"]
  },
  {
    id: "implicit_differentiation", name: "Implicit Differentiation",
    definition: "A technique for finding the derivative of a function defined implicitly by an equation.",
    latex: "\\frac{dy}{dx} = F(x, y)",
    depends_on: ["derivative", "implicit_functions"]
  },
  {
    id: "differential", name: "Differential",
    definition: "The differential of a function is the principal part of its change.",
    latex: "df = f'(x)dx",
    depends_on: ["derivative", "infintesimal"]
  },
  {
    id: "ode", name: "Ordinary Differential Equation",
    definition: "An equation involving an unknown function and its derivatives.",
    latex: "F(x, y, y', y'', \\ldots, y^{(n)}) = 0",
    depends_on: ["differential", "derivative", "implicit_differentiation"]
  },
  {
    id: "first_order_ode", name: "First-Order ODE",
    definition: "An ordinary differential equation of the first order.",
    latex: "F(x, y, y') = 0",
    depends_on: ["ode"]
  },
  {
    id: "linear_ode", name: "Linear ODE",
    definition: "An ordinary differential equation of the first order that is linear in the unknown function and its derivatives.",
    latex: "a_1(x)y' + a_0(x)y = b(x)",
    depends_on: ["first_order_ode"]
  },
  {
    id: "separable_ode", name: "Separable ODE",
    definition: "An ordinary differential equation of the first order that can be written as a product of functions of the independent and dependent variables.",
    latex: "\\frac{dy}{dx} = f(x)g(y)",
    depends_on: ["first_order_ode"]
  },
  {
    id: "equilibrium_solution", name: "Equilibrium Solution",
    definition: "A constant solution to a differential equation where the rate of change is zero. An equilibrium solution is considered stable if small perturbations around it decay back to the equilibrium, and unstable if they grow away from it.",
    latex: "y' = 0",
    depends_on: ["ode"]
  },
  {
    id: "exponential_change", name: "Exponential Change",
    definition: "A process where the rate of change is proportional to the current value.",
    latex: "y \\prime = ky \\implies y = Ce^{kx}",
    depends_on: ["first_order_ode", "chain_rule", "exponential_function"]
  },
  {
    id: "linear_autonomous_ode", name: "First-Order Linear Autonomous ODE",
    definition: "An ordinary differential equation of the first order that is linear and does not explicitly depend on the independent variable. The general solution is the sum of the homogeneous and particular solutions.",
    latex: "y' = ky + b, \\quad y = Ce^{kx} - \\frac{b}{k}",
    depends_on: ["first_order_ode", "linear_ode", "separable_ode"]
  },
  {
    id: "logistic_equation", name: "Logistic Equation",
    definition: "A first-order linear autonomous ODE that models population growth with a carrying capacity.",
    latex: "y' = r y \\left(1 - \\frac{y}{K}\\right), \\\\ \\quad y = \\frac{K}{1 + Ce^{-rx}}",
    depends_on: ["first_order_ode", "linear_autonomous_ode"]
  },
  {
    id: "u_sub", name: "U-Substitution",
    definition: "A technique for evaluating integrals by changing variables. It is the integral counterpart to the chain rule for derivatives, allowing us to simplify integrals by substituting a part of the integrand with a new variable.",
    latex: "\\int f(g(x))g'(x)\\, dx = \\\\ \\int f(u)\\, du \\quad , u = g(x)",
    depends_on: ["integral", "chain_rule"]
  },
  {
    id: "ibp", name: "Integration by Parts",
    definition: "A technique for evaluating integrals by expressing the integral of a product of functions in terms of the integral of their derivative and antiderivative. It is derived from the product rule for differentiation.",
    latex: "\\int u\\, dv = uv - \\int v\\, du",
    depends_on: ["integral", "product_rule"]
  },
  {
    id: "pfi", name: "Partial Fraction Integration",
    definition: "A technique for evaluating integrals of rational functions by decomposing the function into simpler fractions that can be integrated individually.",
    latex: "\\int \\frac{P(x)}{Q(x)}\\, dx = \\\\ \\int \\sum \\frac{A_i}{(x - r_i)^{m_i}}\\, dx",
    depends_on: ["integral", "pfd"]
  },
  {
    id: "improper_integrals", name: "Improper Integrals",
    definition: "Integrals with infinite limits or integrands that diverge to infinity within the interval of integration.",
    latex: "\\int_a^\\infty f(x)\\, dx = \\lim_{t \\to \\infty} \\int_a^t f(x)\\, dx",
    depends_on: ["integral", "limits", "infinity", "divergence"]
  },
  {
    id: "power_rule", name: "Power Rule",
    definition: "The derivative of a power function x^n is n times x raised to n minus one.",
    latex: "\\frac{d}{dx}\\, x^n = n x^{n-1}",
    depends_on: ["derivative", "binomial_theorem"]
  },
  {
    id: "chain_rule", name: "Chain Rule",
    definition: "A rule for differentiating compositions of functions.",
    latex: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)",
    depends_on: ["derivative"]
  },
  {
    id: "sum_difference_rule", name: "Sum and Difference Rule",
    definition: "A rule for differentiating the sum or difference of two functions.",
    latex: "\\frac{d}{dx}[f(x) \\pm g(x)] = \\\\ f'(x) \\pm g'(x)",
    depends_on: ["derivative"]
  },
  {
    id: "product_rule", name: "Product Rule",
    definition: "A rule for differentiating the product of two functions.",
    latex: "\\frac{d}{dx}[f(x)g(x)] = \\\\ f'(x)g(x) + f(x)g'(x)",
    depends_on: ["derivative"]
  },
  {
    id: "quotient_rule", name: "Quotient Rule",
    definition: "A rule for differentiating the quotient of two functions.",
    latex: "\\frac{d}{dx}\\left(\\frac{f(x)}{g(x)}\\right) = \\\\ \\frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}",
    depends_on: ["derivative", "product_rule"]
  },
  {
    id: "derivative_of_constant", name: "Constant Derivative",
    definition: "The derivative of a constant function is zero.",
    latex: "\\frac{d}{dx}[c] = 0",
    depends_on: ["derivative"]
  },
  {
    id: "derivative_of_variable", name: "Variable Derivative",
    definition: "The derivative of the identity function is one.",
    latex: "\\frac{d}{dx}[x] = 1",
    depends_on: ["derivative"]
  },
  {
    id: "derivative_product_constant_function", name: "Product of a Constant and a Function Derivative",
    definition: "The derivative of a constant times a function is the constant times the derivative of the function.",
    latex: "\\frac{d}{dx}[cf(x)] = c f'(x)",
    depends_on: ["derivative", "derivative_of_constant"]
  },
  {
    id: "derivative_of_exponential", name: "Exponential Function Derivative",
    definition: "The derivative of an exponential function with base a is the product of the function and the natural logarithm of the base.",
    latex: "\\frac{d}{dx}[a^x] = a^x \\ln(a)",
    depends_on: ["derivative", "exponential_function"]
  },
  {
    id: "derivative_eulers_exponential", name: "Euler's Number Exponential Derivative",
    definition: "The derivative of the exponential function with base e is the function itself.",
    latex: "\\frac{d}{dx}[e^x] = e^x",
    depends_on: ["derivative_of_exponential", "eulers_number"]
  },
  {
    id: "derivative_of_logarithm", name: "Logarithmic Function Derivative",
    definition: "The derivative of the logarithmic function with base a is the reciprocal of the product of the argument and the natural logarithm of the base.",
    latex: "\\frac{d}{dx}[\\log_a(x)] = \\frac{1}{x \\ln(a)}",
    depends_on: ["derivative", "logarithms"]
  },
  {
    id: "derivative_eulers_logarithm", name: "Euler's Number Logarithmic Derivative",
    definition: "The derivative of the logarithmic function with base e is the reciprocal of the argument.",
    latex: "\\frac{d}{dx}[\\ln(x)] = \\frac{1}{x}",
    depends_on: ["derivative_of_logarithm", "eulers_number"]
  },
  {
    id: "sine_limit", name: "Sine Limit",
    definition: "The limit of the sine function divided by its argument as the argument approaches zero is one.",
    latex: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1",
    depends_on: ["sine", "limits", "triangle", "inequality"]
  },
  {
    id: "derivative_of_sine", name: "Sine Derivative",
    definition: "The derivative of the sine function is the cosine function.",
    latex: "\\frac{d}{dx}[\\sin(x)] = \\cos(x)",
    depends_on: ["derivative", "sine", "sine_limit"]
  },
  {
    id: "derivative_of_cosine", name: "Cosine Derivative",
    definition: "The derivative of the cosine function is the negative of the sine function.",
    latex: "\\frac{d}{dx}[\\cos(x)] = -\\sin(x)",
    depends_on: ["derivative", "cosine", "cofunction_sine"]
  },
  {
    id: "derivative_of_tangent", name: "Tangent Derivative",
    definition: "The derivative of the tangent function is the square of the secant function.",
    latex: "\\frac{d}{dx}[\\tan(x)] = \\sec^2(x)",
    depends_on: ["tangent", "secant", "derivative_of_sine", "derivative_of_cosine", "quotient_rule"]
  },
  {
    id: "derivative_of_cotangent", name: "Cotangent Derivative",
    definition: "The derivative of the cotangent function is the negative of the square of the cosecant function.",
    latex: "\\frac{d}{dx}[\\cot(x)] = -\\csc^2(x)",
    depends_on: ["cotangent", "cosecant", "derivative_of_tangent", "chain_rule"]
  },
  {
    id: "derivative_of_cosecant", name: "Cosecant Derivative",
    definition: "The derivative of the cosecant function is the negative of the product of the cosecant and cotangent functions.",
    latex: "\\frac{d}{dx}[\\csc(x)] = -\\csc(x) \\cot(x)",
    depends_on: ["cosecant", "derivative_of_sine", "chain_rule"]
  },
  {
    id: "derivative_of_secant", name: "Secant Derivative",
    definition: "The derivative of the secant function is the product of the secant and tangent functions.",
    latex: "\\frac{d}{dx}[\\sec(x)] = \\sec(x) \\tan(x)",
    depends_on: ["secant", "derivative_of_cosine", "chain_rule"]
  },
  {
    id: "derivative_of_arcsine", name: "Arcsine Derivative",
    definition: "The derivative of the arcsine function is the reciprocal of the square root of one minus the square of the argument.",
    latex: "\\frac{d}{dx}[\\sin^{-1}(x)] = \\frac{1}{\\sqrt{1 - x^2}}",
    depends_on: ["derivative", "arcsine"]
  },
  {
    id: "derivative_of_arccosine", name: "Arccosine Derivative",
    definition: "The derivative of the arccosine function is the negative reciprocal of the square root of one minus the square of the argument.",
    latex: "\\frac{d}{dx}[\\cos^{-1}(x)] = -\\frac{1}{\\sqrt{1 - x^2}}",
    depends_on: ["derivative", "arccosine"]
  },
  {
    id: "derivative_of_arctangent", name: "Arctangent Derivative",
    definition: "The derivative of the arctangent function is the reciprocal of one plus the square of the argument.",
    latex: "\\frac{d}{dx}[\\tan^{-1}(x)] = \\frac{1}{1 + x^2}",
    depends_on: ["derivative", "arctangent"]
  },
  {
    id: "derivative_of_arccotangent", name: "Arccotangent Derivative",
    definition: "The derivative of the arccotangent function is the negative reciprocal of one plus the square of the argument.",
    latex: "\\frac{d}{dx}[\\cot^{-1}(x)] = -\\frac{1}{1 + x^2}",
    depends_on: ["derivative", "arccotangent"]
  },
  {
    id: "derivative_of_arccosecant", name: "Arccosecant Derivative",
    definition: "The derivative of the arccosecant function is the negative reciprocal of the product of the absolute value of the argument and the square root of the argument squared minus one.",
    latex: "\\frac{d}{dx}[\\csc^{-1}(x)] = -\\frac{1}{|x| \\sqrt{x^2 - 1}}",
    depends_on: ["derivative", "arccosecant"]
  },
  {
    id: "derivative_of_arcsecant", name: "Arcsecant Derivative",
    definition: "The derivative of the arcsecant function is the reciprocal of the product of the absolute value of the argument and the square root of the argument squared minus one.",
    latex: "\\frac{d}{dx}[\\sec^{-1}(x)] = \\frac{1}{|x| \\sqrt{x^2 - 1}}",
    depends_on: ["derivative", "arcsecant"]
  },
  {
    id: "derivative_of_sinh", name: "Hyperbolic Sine Derivative",
    definition: "The derivative of the hyperbolic sine function is the hyperbolic cosine function.",
    latex: "\\frac{d}{dx}[\\sinh(x)] = \\cosh(x)",
    depends_on: ["derivative", "hyperbolic_sine"]
  },
  {
    id: "derivative_of_cosh", name: "Hyperbolic Cosine Derivative",
    definition: "The derivative of the hyperbolic cosine function is the hyperbolic sine function.",
    latex: "\\frac{d}{dx}[\\cosh(x)] = \\sinh(x)",
    depends_on: ["derivative", "hyperbolic_cosine"]
  },
  {
    id: "derivative_absolute_value", name: "Absolute Value Derivative",
    definition: "The derivative of the absolute value function is the sign function.",
    latex: "\\frac{d}{dx}[|x|] = \\frac{x}{|x|}",
    depends_on: ["derivative", "absolute_value"]
  },
  {
    id: "ftc1", name: "Fundamental Theorem of Calculus Part I",
    definition: "Differentiation and integration are inverse operations. The derivative of the integral of a function is the original function.",
    latex: "\\frac{d}{dx} \\left( \\int_{a}^{x} f(t) \\, dt \\right) = f(x)",
    depends_on: ["derivative", "integral"]
  },
  {
    id: "ftc2", name: "Fundamental Theorem of Calculus Part II",
    definition: "Integrals of functions can be evaluated using antiderivatives. The integral of a function over an interval can be computed using any one of its infinitely many antiderivatives.",
    latex: "\\int_a^b f(x)\\, dx = F(b) - F(a)",
    depends_on: ["ftc1"]
  },
];