---
title: Matrix Rank
draft: false
tags: 
date: 2024-09-09 12:37
---
**رتبهٔ ماتریس** یا Matrix Rank، تعداد سطرها یا ستون‌های خطی مستقل در یک ماتریس دارد. رتبهٔ یک ماتریس نشان‌دهندهٔ بیشترین تعداد سطرها یا ستون‌هایی است که نمی‌توان آنها را به‌صورت ترکیبی خطی از سطرها یا ستون‌های دیگر بیان کرد.

مثلاً رتبهٔ ماتریس پایین برابر ۲ است. چرا که با انجام عملیات [حذف گاوسی](https://en.wikipedia.org/wiki/Gaussian_elimination) دو سطر از آن ناصفر باقی می‌ماند.

$$
\mathbf{A} = 
\begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix}
$$

مرحلهٔ اول:

$$
R_2 \rightarrow R_2 - 4R_1, \quad R_3 \rightarrow R_3 - 7R_1
$$

$$

\mathbf{A} = \begin{pmatrix} 1 & 2 & 3 \\ 0 & -3 & -6 \\ 0 & -6 & -12 \end{pmatrix}
$$

مرحلهٔ دوم:

$$
R_3 \rightarrow R_3 - 2R_2
$$

$$
\mathbf{A} = \begin{pmatrix} 1 & 2 & 3 \\ 0 & -3 & -6 \\ 0 & 0 & 0 \end{pmatrix}
$$

مرتب‌سازی ماتریس:

$$
\mathbf{A} = \begin{pmatrix} 1 & 2 & 3 \\ 0 & 1 & 2 \\ 0 & 0 & 0 \end{pmatrix}
$$