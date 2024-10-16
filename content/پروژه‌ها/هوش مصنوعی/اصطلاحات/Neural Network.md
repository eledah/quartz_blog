---
title: Neural Network
draft: false
tags: 
date: 2024-09-09 13:41
---
**شبکه عصبی**[^1] یک مدل محاسباتیِ الهام گرفته از مغز انسان است. هر شبکه از مجموعه‌ای از واحدهای محاسباتی به نام **نورون**[^2] تشکیل شده است. هر نورون ورودی‌هایی دریافت می‌کند، آنها را وزن‌دهی می‌کند و سپس یک خروجی تولید می‌کند که به نورون‌های لایه بعدی منتقل می‌شود.

<iframe width="100%" height="300px" src="https://eledah.github.io/quartz_blog/attachment/neural-network.html"></iframe>

شبکه عصبی به طور معمول از چندین لایه تشکیل شده است: **لایه ورودی**[^3] که داده‌های خام را دریافت می‌کند، **لایه‌های پنهان**[^4] که پردازش‌های میانی انجام می‌دهند، و **لایه خروجی**[^5] که نتیجه نهایی را ارائه می‌دهد. این مدل از طریق یک فرآیند به نام **یادگیری**[^6]  یا **آموزش**[^7] -که شامل تنظیم وزن‌های بین نورون‌ها با استفاده از روش‌هایی مثل [[Backpropagation|انتشار معکوس]][^8] است- بهینه‌سازی می‌شود

هدف از یادگیری این است که شبکه به گونه‌ای آموزش ببیند که خروجی‌های دقیقی برای ورودی‌های داده شده پیش‌بینی کند. این روش در مسائل متنوعی مانند تشخیص تصویر، پردازش زبان طبیعی و بازیابی اطلاعات کاربرد دارد.

برای دیدن سازوکار شبکه‌های عصبی از نزدیک، سایت [TensorFlow](https://playground.tensorflow.org/)‌را ببینید. برای دیدن یک شبکه عصبی دیگر که اعداد انگلیسی را با کمک ماتریس‌ها تشخیص می‌دهد، [اینجا](https://adamharley.com/nn_vis/cnn/2d.html) را ببینید.

<video src="https://private-user-images.githubusercontent.com/131465095/367596286-ab8b31a4-25ad-453d-9cad-147bc444271c.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjY0ODA3MzIsIm5iZiI6MTcyNjQ4MDQzMiwicGF0aCI6Ii8xMzE0NjUwOTUvMzY3NTk2Mjg2LWFiOGIzMWE0LTI1YWQtNDUzZC05Y2FkLTE0N2JjNDQ0MjcxYy5tcDQ_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwOTE2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDkxNlQwOTUzNTJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0xYmM2ODQ0ZGMwOTRlYTRlM2YzYjVkM2YxZjNhNGZmYTYxYzQ0ZmIwYjFhMDQ5YzVhYWJkZjQzZTM4NDg4MWJlJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.PcmuFBXbXTWDw0-Drtmc9TFfinj03gsMShynhAje4vQ" data-canonical-src="https://private-user-images.githubusercontent.com/131465095/367596286-ab8b31a4-25ad-453d-9cad-147bc444271c.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjY0ODA3MzIsIm5iZiI6MTcyNjQ4MDQzMiwicGF0aCI6Ii8xMzE0NjUwOTUvMzY3NTk2Mjg2LWFiOGIzMWE0LTI1YWQtNDUzZC05Y2FkLTE0N2JjNDQ0MjcxYy5tcDQ_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwOTE2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDkxNlQwOTUzNTJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0xYmM2ODQ0ZGMwOTRlYTRlM2YzYjVkM2YxZjNhNGZmYTYxYzQ0ZmIwYjFhMDQ5YzVhYWJkZjQzZTM4NDg4MWJlJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.PcmuFBXbXTWDw0-Drtmc9TFfinj03gsMShynhAje4vQ" controls="controls" muted="muted" class="d-block rounded-bottom-2 border-top width-fit" style="max-height:640px; min-height: 200px"> </video>

[^1]: Neural Network
[^2]: Neuron
[^3]: Input Layer
[^4]: Hidden Layer
[^5]: Output Layer
[^6]: Learning
[^7]: Training
[^8]: Backpropagation
