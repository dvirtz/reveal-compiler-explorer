<!-- .slide: data-background-color="#bee4fd" -->

### reveal-compiler-explorer

![reveal-heart-ce](images/reveal-heart-ce.png)

open, edit & compile code snippets

<div class="row">
  <div class="column">

  [![gitHub](images/GitHub_Logo.png)](https://github.com/dvirtz/reveal-compiler-explorer/tree/master/packages/reveal-compiler-explorer)

  </div>
  <div class="column">

  [![npm version](https://badge.fury.io/js/reveal-compiler-explorer.svg)](https://badge.fury.io/js/reveal-compiler-explorer) 

  </div>
</div>

---

<p id="click-name">click on code to go to compiler explorer</p>

```cpp []
///external
///output=Hello CE!
///execute
#include <iostream>

int main() {
  std::cout << "Hello CE!";
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
///compiler=ldc1_21
///options=-m32
///libs=cblas:trunk,mir_core:trunk
///noexecute
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
        ///compiler=ldc1_21
        ///options=-m32
        ///libs=cblas:trunk,mir_core:trunk
        ///noexecute
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

---

<!-- .slide: data-background-color="#bee4fd" -->

## install now

<div class="row">
  <div class="column">

  [![gitHub](images/GitHub_Logo.png)](https://github.com/dvirtz/reveal-compiler-explorer/tree/master/packages/reveal-compiler-explorer)

  </div>
  <div class="column">

  [![npm version](https://badge.fury.io/js/reveal-compiler-explorer.svg)](https://badge.fury.io/js/reveal-compiler-explorer) 

  </div>
</div>
