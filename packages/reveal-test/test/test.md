## reveal-compiler-explorer

<div class="row">
  <div class="column">
    <img src="images/reveal-black-text.svg" alt="reveal">
  </div>
  <div class="column">
    <img src="images/heart.png" alt="heart">
  </div>
  <div class="column">
    <img src="images/ce.svg" alt="ce">
  </div>
</div>

---

Ctrl-click (or ⌘-click) on code to go to compiler explorer

```cpp
///external
///fails=missing semicolon
#include <iostream>

int main() {
  std::cout << "Hello CE!"
}
```

---

Use `///` directives for configuring a specific code snippet. 
The directives will not be shown on the presentation.

Use `///hide` and `///unhide` directives for hiding other code parts.
The hidden code will be sent to CE along with the visible code.

See example on next slide.

---

<table>
  <tr>
    <td>markdown</td>
    <td>rendered</td>
  </tr>
  <tr>
    <td>
      <pre style="font-size: 0.3em; display: table-cell;">
```d
///compiler=ldc1_20
///options=-m32
///libs=cblas:trunk
///hide
import cblas;
<br/>
void main()
{
///unhide
double[] A = [1, 0, 0,
              0, 1, 1];
double[] B = [1, 0,
              0, 1,
              2, 2];
auto C = new double[2*2];
<br/>
gemm(Order.RowMajor, Transpose.NoTrans, Transpose.NoTrans,
        2, 2, 3, /*no scaling*/1,
        A.ptr, 3, B.ptr, 2, /*no addition*/0, C.ptr, 2);
<br/>
assert(C == [1, 0,
             2, 3]);
///hide
}
```
      </pre>
    </td>
    <td>
      <pre style="font-size: 0.3em; display: table-cell;"><code data-trim data-noescape class="d">
///compiler=ldc1_20
///options=-m32
///libs=cblas:trunk
///hide
import cblas;
<br/>
void main()
{
///unhide
double[] A = [1, 0, 0,
              0, 1, 1];
double[] B = [1, 0,
              0, 1,
              2, 2];
auto C = new double[2*2];
<br/>
gemm(Order.RowMajor, Transpose.NoTrans, Transpose.NoTrans,
        2, 2, 3, /*no scaling*/1,
        A.ptr, 3, B.ptr, 2, /*no addition*/0, C.ptr, 2);
<br/>
assert(C == [1, 0,
             2, 3]);
///hide
}
      </code></pre>
    </td>
  </tr>
</table>