---
title: ساختن مدل و خلق تصویر با SDXL
draft: false
tags:
  - AI
  - آموزش
date: 2024-09-16 10:14
---

این متن به شما آموزش می‌دهد که چطور با داشتن ۱۰-۱۲ تصویر از سوژهٔ خود و [[تکنیک LoRA]] با کمک [SDXL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) مدلی بر طبق آن بسازید تا از سوژه در حالات و مکان‌های مختلف با کمک مدل‌های هوش مصنوعی تصویر ایجاد کنید.

| ![[sdxl-ch-13.png]]                           |
| --------------------------------------------- |
| <center>نمونهٔ عکس تولید شده با SDXL</center> |


> [!warning] پیش‌نیازها
>  - کارت اعتباری ویزا. حداقل ۵ دلار. برای پرداخت هزینهٔ مدل‌سازی و تولید عکس. من کارت اعتباری خودم را از سایت [ایرانیکارت](https://www.iranicard.ir/) تهیه کردم.
>  - اکانت سایت [Replicate.com](https://replicate.com/) (رایگان)
>  - حداقل ۱۲ عکس از شخصیت مورد نظر. (بهتر است عکس‌ها با پس‌زمینهٔ سفید و در زاویه‌های مختلف باشند)


> [!danger]  خطر دوباره‌کاری!
> این آموزش بسیار مشابه [[ساختن مدل و خلق تصویر با Flux]] است. اگر آن را خوانده‌اید، می‌توانید مراحل این آموزش را به سرعت رد کنید.

## قدم اول: مقدمات

بعد از ساختن حساب کاربری وارد تنظیمات کاربری خود در سایت Replicate شوید و منوی `Billing` را باز کنید. اطلاعات کارت اعتباری خودتان را از طریق این صفحه وارد کنید. با استفاده از جعبهٔ متن پایین بخش `Spend Limit` هم می‌توانید یک سقف برداشت از حساب خودتان تعیین کنید.

هزینه‌های ساخت مدل و تولید خروجی متن یا عکس در [صفحهٔ Pricing](https://replicate.com/pricing) سایت آمده است. برای نیاز ما و طبق تجربه، ساخت یک مدل ساده از چهره حدود ۵۰ سنت و هزینهٔ تولید هر عکس با مدل ساخته شده ۱ سنت خرج دارد.

![](attachment/1717433d0e6cd5bbd25bb24140fa8797.png)

مدل SDXL که قصد ساختن آن را داریم، با `Nvidia A40` و [[تکنیک LoRA]] آموزش داده می‌شود. یادگیری مدل حدود ۱۰ دقیقه طول می‌کشد. تولید تصویر هم با کانفیگ یکسان و حدود ۲۰ ثانیه زمان می‌برد.

## قدم دوم: ساختن مدل

برای ساختن مدل ابتدا باید عکس‌های مرجع را جمع‌آوری کنیم. در این پروژه ۱۳ عکس مختلف از شهید مصطفی چمران از طریق اینترنت جمع‌آوری شد. پس از جمع‌آوری عکس‌ها، نوبت به نام‌گذاری آن‌ها می‌رسد. نام‌گذاری عکس‌ها باید به فرمت باشد:

```
a_photo_of_TOK.jpg/png/...
```

که در آن `TOK` همان عبارتی است که می‌خواهیم به مدل اضافه کنیم. مقدار TOK باید یک اسم خاص باشد تا با باقی عبارات مدل اشتباه گرفته نشود. مثل `CHMRN` یا `MCHRAN` یا هر عبارت یکتای دیگری. در اینجا ما با خود عبارت `chamran` عکس‌ها را مشخص کردیم. برای جلوگیری از دوباره‌کاری، می‌توان همهٔ عکس‌ها را انتخاب کرد و بعد با استفاده از کلید `F2` اسم یکی از آن‌ها را به `a_photo_of_chamran.jpg` تغییر داد. در این‌صورت خود ویندوز به همهٔ آن‌ها یک پسوند عددی اضافه می‌کند.

![](attachment/a8398fbc203e4874de4eccbf363471a2.png)

بعد از جمع‌آوری عکس‌ها، همهٔ آن‌ها را داخل یک فایل Zip فشرده می‌کنیم. این ورودی ما به مدل است.


> [!NOTE] کپشن زدن برای عکس‌ها
> در صورتی که می‌خواهید مدل شما عملکرد دقیق‌تری داشته باشد، می‌توانید همراه هر عکس یک فایل با فرمت txt ایجاد کنید که در آن عکس توصیف شده است. همچنین برای توصیف عکس‌‌ها می‌توانید از مدل‌هایی مثل [blip](https://replicate.com/salesforce/blip) هم استفاده کنید.


برای ساختن مدل از ورودی‌ها، وارد Replicate می‌شویم و [stability-ai/sdxl](https://replicate.com/stability-ai/sdxl/train) ‌را پیدا می‌کنیم. این جعبه‌ابزار فایل مدلی برای ما می‌سازد که عبارت `chamran` را به مدل می‌فهماند. داخل صفحهٔ جدید تبِ Train را انتخاب می‌کنیم.

![[Pasted image 20240916102958.png]]

برای مقدار `destination`، گزینهٔ `Create new model` را انتخاب می‌کنیم و اسم دلخواهی برای مدل خودمان انتخاب می‌کنیم. مثلاً من `sdxl-lora-character-chamran` را انتخاب کرده‌ام.

![[Pasted image 20240916103056.png]]

در گام بعدی، فایل Zip عکس‌های انتخابی را در فیلد `input_images` آپلود می‌کنیم. مقدار فیلد `seed` را خالی می‌گذاریم و برای `token_string` مقدار `chamran` را انتخاب می‌کنیم. این همان مقداری است که بعدتر برای فراخوانی شخصیت موردنظر خود در پرامپت وارد خواهیم کرد. در انتها هم برای `caption_prefix` مقدار `a photo of chamran,` را می‌نویسیم و مقدار `max_train_steps` را دست‌نخورده باقی می‌گذاریم. برای تشخیص بهتر چهره و افزایش کیفیت مدل هم تیک `use_face_detection_instead` را می‌زنیم.


> [!NOTE] اگر به جای چهره، قصد ساختن مدلی با الهام از سبک هنرمندان را دارید
> تیک `use_face_detection_instead` را نزنید. تعداد قدم‌های یادگیری را هم بالاتر ببرید. (صدبرابر تعداد عکس‌های ورودی مقدار مناسبی است.). مقدار `caption_prefix` را هم به `in style of TOK,` تغییر دهید.


![[Pasted image 20240916104310.png]]

بعد از وارد کردن تمامی این مقادیر، دکمهٔ `Create training` را بفشارید تا ساخت مدل `SDXL` برای شما آغاز شود.

![[Pasted image 20240916113026.png]]

> [!tip] رفع محدودیت‌ها با کدنویسی
> فیلد‌هایی که در این صفحه می‌بینید، تنها متغیرهای مدل نیستند. برای دسترسی و تغییر آن‌ها، باید یادگیری مدل را از طریق API انجام دهید. مثلاً متغیری مثل `is_lora` در مدل وجود دارد که در صورت داشتن مقدار `False`، به جای استفاده از [[تکنیک LoRA]] کل مدل را Fine-Tune می‌کنید و چندبرابر زمان بیشتری می‌برد. برای آشنایی با شیوهٔ آموزش با کد، [[ساختن مدل و خلق تصویر با SDXL#ضمیمه ۱ تمرین مدل با کد|ضمیمهٔ اول]] همین مطلب را ببینید.

بعد از انجام یادگیری می‌توانید [[Model Weights|وزن‌های مدل]] را دانلود کنید تا به صورت لوکال از آن استفاده کنید یا اینکه با فشردن دکمهٔ `Run trained model` وارد صفحه‌ای جدید برای تولید تصاویر شوید.

## قدم سوم: ساختن تصاویر با مدل

اگر در انتهای مرحلهٔ قبل گزینهٔ `Run trained model` را انتخاب کرده باشید، با این صفحه مواجه خواهید شد:

![[Pasted image 20240916113319.png]]

فیلدهای تولید عکس به این شرح است:

### فیلد prompt

دستوری است که برای ساخت عکس به مدل می‌دهید. برای فراخوانی شخصیت‌های خود، به تجربه بهتر است در ابتدای پرامپت از آن‌ها نام ببرید تا انتهای پرامپت. برای بهتر شدن پرامپت همچنین می‌توانید از مدل‌های زبانی مثل ChatGPT و Claude هم استفاده کنید. مثلاً فرض کنید می‌خواهیم تصویری از شهید چمران در یک آزمایشگاه فیزیک تولید کنیم. من یک توصیف اولیه برای مدل زبانی می‌نویسم و از آن می‌خواهم که آن را برای من بهبود دهد:

```
Enhance this prompt for me to use in a AI image generator. Provide 5 alternate prompts for me to choose from:

<A quantum physicist in a labcoat doing experiments in a futuristic labaratory>
```

![](attachment/08315f3e158c936e214aab1d90bfcdd4.png)

از بین این پرامپت‌ها، یکی را که به نظرم بهتر است را انتخاب می‌کنم و توکن اختصاصی خودم (`chamran`) را در آن جا می‌دهم و آن را در فیلد `prompt` مدل می‌گذارم:

```
chamran as a quantum physicist in a modern lab coat, performing intricate experiments in a high-tech futuristic lab, illuminated by glowing instruments and screens
```

### فیلد `negative_prompt`\

درست برعکس پرامپت، این فیلد شامل مواردی است که نمی‌خواهیم در عکس باشد. مثلا اگر می‌خواهیم خروجی در شب باشد، «روز» را به این فیلد اضافه می‌کنیم. علاوه بر این‌ها، مدل‌های تولید تصویر در خراب کردن جزئیات مثل تعداد انگشتان یا چشم‌ها زبانزد هستند. یکی از راه‌های جلوگیری از این قضیه، اضافه کردن خرابی‌های احتمالی به فیلد `negative_prompt` است.

> [!example]- یک نمونه از `negative_prompt`
> ```
> (((deformed))), blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, (extra_limb), (ugly), (poorly drawn hands), fused fingers, messy drawing, broken legs censor, censored, censor_bar, multiple breasts, (mutated hands and fingers:1.5), (long body :1.3), (mutation, poorly drawn :1.2), black-white, bad anatomy, liquid body, liquidtongue, disfigured, malformed, mutated, anatomical nonsense, text font ui, error, malformed hands, long neck, blurred, lowers, low res, bad anatomy, bad proportions, bad shadow, uncoordinated body, unnatural body, fused breasts, bad breasts, huge breasts, poorly drawn breasts, extra breasts, liquid breasts, heavy breasts, missingbreasts, huge haunch, huge thighs, huge calf, bad hands, fused hand, missing hand, disappearing arms, disappearing thigh, disappearing calf, disappearing legs, fusedears, bad ears, poorly drawn ears, extra ears, liquid ears, heavy ears, missing ears, old photo, low res, black and white, black and white filter, colorless, (((deformed))), blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, (extra_limb), (ugly), (poorly drawn hands), fused fingers, messy drawing, broken legs censor, censored, censor_bar, multiple breasts, (mutated hands and fingers:1.5), (long body :1.3), (mutation, poorly drawn :1.2), black-white, bad anatomy, liquid body, liquid tongue, disfigured, malformed, mutated, anatomical nonsense, text font ui, error, malformed hands, long neck, blurred, lowers, low res, bad anatomy, bad proportions, bad shadow, uncoordinated body, unnatural body, fused breasts, bad breasts, huge breasts, poorly drawn breasts, extra breasts, liquid breasts, heavy breasts, missing breasts, huge haunch, huge thighs, huge calf, bad hands, fused hand, missing hand, disappearing arms, disappearing thigh, disappearing calf, disappearing legs, fused ears, bad ears, poorly drawn ears, extra ears, liquid ears, heavy ears, missing ears, old photo, low res, black and white, black and white filter, colorless, (((deformed))), blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, (extra_limb), (ugly), (poorly drawn hands), fused fingers, messy drawing, broken legs censor, censored, censor_bar, multiple breasts, (mutated hands and fingers:1.5), (long body :1.3), (mutation, poorly drawn :1.2), black-white, bad anatomy, liquid body, liquid tongue, disfigured, malformed, mutated, anatomical nonsense, text font ui, error, malformed hands, long neck, blurred, lowers, low res, bad anatomy, bad proportions, bad shadow, uncoordinated body, unnatural body, fused breasts, bad breasts, huge breasts, poorly drawn breasts, extra breasts, liquid breasts, heavy breasts, missing breasts, huge haunch, huge thighs, huge calf, bad hands, fused hand, missing hand, disappearing arms, disappearing thigh, disappearing calf, disappearing legs, fused ears, bad ears, poorly drawn ears, extra ears, liquid ears, heavy ears, missing ears, (((deformed))), blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, (extra_limb), (ugly), (poorly drawn hands), fused fingers, messy drawing, broken legs censor, censored, censor_bar, multiple breasts, (mutated hands and fingers:1.5), (long body :1.3), (mutation, poorly drawn :1.2), black-white, bad anatomy, liquid body, liquidtongue, disfigured, malformed, mutated, anatomical nonsense, text font ui, error, malformed hands, long neck, blurred, lowers, low res, bad anatomy, bad proportions, bad shadow, uncoordinated body, unnatural body, fused breasts, bad breasts, huge breasts, poorly drawn breasts, extra breasts, liquid breasts, heavy breasts, missingbreasts, huge haunch, huge thighs, huge calf, bad hands, fused hand, missing hand, disappearing arms, disappearing thigh, disappearing calf, disappearing legs, fusedears, bad ears, poorly drawn ears, extra ears, liquid ears, heavy ears, missing ears,
> ```

با ثابت نگه‌داشتن مقدار فیلد `seed` و دستکاری پرامپت منفی، می‌توانیم تأثیر آن را بر روی خروجی‌ها ببینیم:


| ![[ch-sdxl-1.jpg\|500]]                                                                  |
| ---------------------------------------------------------------------------------------- |
| <center>تصاویری که پرامپت منفی بالا برایشان لحاظ شده، کیفیت و دقت بیشتری دارند.</center> |


پس در صورتی که جزئیات چهره یا اندام شخصیت با دلخواه شما تعارضی داشت، می‌توانید با تغییر پرامپت عادی یا پرامپت منفی این تعارض را برطرف کنید.


| ![[ch-sdxl-2.jpg\|500]]                                                                  |
| ---------------------------------------------------------------------------------------- |
| <center>خرابکاری مدل در ساخت چهره تا حدی با کمک پرامپت‌های منفی قابل اصلاح است.</center> |

### فیلد `image`

این مدل علاوه بر متن، تصویر هم ورودی می‌گیرد. مثلاً می‌توان یک عکس عادی به آن داد و از آن خواست که چهرهٔ مدنظر ما را با آن جایگزین کند.

![[ch-sdxl-3.jpg]]

### فیلد `mask`

این فیلد برای انجام کارهای `inpainting` لازم است. مثلاً اگر عکس شما نیاز به اصلاحات جزئی در لباس شخصیت داشته باشد، کافیست عکسی را آپلود کنید که در آن قسمت‌های نیازمند تغییر به رنگ سفید و باقی سیاه باشند. در این حالت مدل تنها قسمت‌های سفید را تغییر می‌دهد.

### فیلدهای `width` و  `height`

این دو فیلد طول و عرض عکس خروجی را تعیین می‌کنند. اگر به دنبال عکس‌هایی با ابعاد بالا هستید، بهتر است ابتدا آن را با ابعاد پایین با این مدل تولید کنید و سپس با کمک مدل‌هایی مثل [real-esrgan](https://replicate.com/nightmareai/real-esrgan) کیفیت و ابعادش را بالاتر ببرید.

### فیلد `num_outputs`

تعداد خروجی‌های مدل را تعیین می‌کند.

### فیلدهای `scheduler, num_inference_steps, guidance_scale, prompt_strength` 

بهتر است این فیلدها را دست‌نخورده باقی بگذارید.

### فیلد `seed`

مقدار `seed` عددی تصادفی است که ساختن تصویر با آن آغاز می‌شود. اگر می‌خواهید هر بار خروجی یکسانی بگیرید و اثر باقی فیلدها را روی خروجی بسنجید، مقدار آن را یک عدد ثابت بگذارید؛ در غیر این‌صورت مقدارش را پاک کنید تا هر بار عکس‌هایی تصادفی تولید شود.

### فیلدهای `refine, high_noise_frac, refine_steps, apply_watermark`

بهتر است این فیلدها را دست‌نخورده باقی بگذارید.
### فیلد `lora_scale`

وزن مدل شما در تولید تصویر. وزن ۱ بیشترین و وزن ۰ کمترین تعهد به مدل را دارد. مقدار ۰٫۸ برای آن مناسب است. چرا که گاهی اوقات با وزن ۱ علاوه بر چهره، لباس‌ها هم تکرار می‌شوند. اگر وزن ۰٫۸ خروجی‌های ناسازگاری به شما داد، بهتر است مقدار آن را دستکاری کنید.

![[sdxl-ch-10.jpg]]

تغییر تدریجی مقدار `lora_scale` و نزدیک شدن به چهرهٔ دلخواه را در نمونهٔ زیر هم می‌توانید ببینید:

![[clideo_editor_9ac7085ad46a472d8b72fb31e04a7a78.mp4]]

بعد از اعمال تنظیمات، دکمهٔ `Run` را بزنید. مدل در عرض چند ثانیه تصاویر با چهرهٔ انتخابی برای شما می‌سازد. خلق تصاویر مختلف نیازمند خلاقیت در ایجاد سناریوهاست و دستکاری متغیرهای مدل است. مدل‌های زبانی می‌توانند در خلق این سناریوها به ما کمک کنند.

## ضمیمه ۱: تمرین مدل با کد

اگر اهل برنامه‌نویسی هستید، کل مراحل بالا را می‌توان با کد پایتون هم انجام داد. بخش اول کد پایین، برای شما مدلی در سایت `replicate.com` با اسم انتخابی می‌سازد. برای این کار اول از همه باید `API_TOKEN` خودتان را برای سایت `Replicate` از [این صفحه](https://replicate.com/account/api-tokens) بردارید و داخل فایلی با نام `.env` در پوشهٔ کد قرار دهید. به این شکل:

```shell
REPLICATE_API_TOKEN=r8_PE*********************************
```

```python
import replicate

# Create a new Replicate model
new_model = replicate.models.create(
    owner="USERNAME",
    name="MODELNAME",
    visibility="public",
    hardware="gpu-a40-large",
    description="SDXL LoRA model for generating images of Chamran"
)

print(f"New model created: {new_model.name}")
print(f"Model URL: https://replicate.com{new_model.url}")
```

در بخش دوم، برنامه فایل ورودی `input.zip` را از شما می‌گیرد و آن را برای مدل می‌فرستد. بعد از آغاز یادگیری مدل، لینک یادگیری در ترمینال برای شما نمایش داده خواهد شد.

```python
training = replicate.trainings.create(
  destination="eledah/sdxl-lora-character-chamran",
  version="stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
  input={
    "input_images": "https://huggingface.co/Eledah/sdxl-lora-character-chamran/resolve/main/photos-of-chamran.zip",
    "token_string": "chamran",
    "caption_prefix": "a photo of chamran, ",
    "max_train_steps": 1500,
    "use_face_detection_instead": True
  },
)

print(f"Training started: {training.status}")
print(f"Training URL: https://replicate.com/p/{training.id}")
```

برای دیدن یادگیری‌های انجام شده توسط خودتان صفحهٔ [Trainings](https://replicate.com/trainings) را ببینید.