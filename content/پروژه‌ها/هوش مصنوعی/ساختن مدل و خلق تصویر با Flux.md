---
title: ساختن مدل و خلق تصویر با Flux
draft: false
tags:
  - آموزش
  - AI
date: 2024-08-28 12:02
---
این متن به شما آموزش می‌دهد که چطور با داشتن ۱۰-۱۲ تصویر از سوژهٔ خود و [[تکنیک LoRA]] با Flux مدلی بر طبق آن بسازید تا از سوژه در حالات و مکان‌های مختلف با کمک مدل‌های هوش مصنوعی تصویر ایجاد کنید.

| ![[ch7.jpg]]                                  |
| --------------------------------------------- |
| <center>نمونهٔ عکس تولید شده با Flux</center> |

> [!warning] پیش‌نیازها
>  - کارت اعتباری ویزا. حداقل ۵ دلار. برای پرداخت هزینهٔ مدل‌سازی و تولید عکس. من کارت اعتباری خودم را از سایت [ایرانیکارت](https://www.iranicard.ir/) تهیه کردم.
>  - اکانت سایت [Replicate.com](https://replicate.com/) (رایگان)
>  - اکانت سایت [Huggingface.co](https://huggingface.co/) (رایگان)
>  - حداقل ۱۲ عکس از شخصیت مورد نظر. (بهتر است عکس‌ها با پس‌زمینهٔ سفید و در زاویه‌های مختلف باشند)

> [!danger]  خطر دوباره‌کاری!
> این آموزش بسیار مشابه [[ساختن مدل و خلق تصویر با SDXL]] است. اگر آن را خوانده‌اید، می‌توانید مراحل این آموزش را به سرعت رد کنید.
## قدم اول: مقدمات

بعد از ساختن حساب کاربری وارد تنظیمات کاربری خود در سایت Replicate شوید و منوی `Billing` را باز کنید. اطلاعات کارت اعتباری خودتان را از طریق این صفحه وارد کنید. با استفاده از جعبهٔ متن پایین بخش `Spend Limit` هم می‌توانید یک سقف برداشت از حساب خودتان تعیین کنید.

هزینه‌های ساخت مدل و تولید خروجی متن یا عکس در [صفحهٔ Pricing](https://replicate.com/pricing) سایت آمده است. برای نیاز ما و طبق تجربه، ساخت هر مدل حدود ۳.۲۱ دلار و هزینهٔ تولید هر عکس با مدل ساخته شده ۳ سنت خرج دارد.

![](attachment/1717433d0e6cd5bbd25bb24140fa8797.png)

مدل Flux که قصد ساختن آن را داریم، با `Nvidia A100` و [[تکنیک LoRA]] آموزش داده می‌شود. یادگیری مدل حدود ۳۰ دقیقه طول می‌کشد. تولید تصویر هم با کانفیگ یکسان و حدود ۲۰ ثانیه زمان می‌برد.

![](attachment/0eab1629724124d8c3a10d459fe6911b.png)

برای ساختن تصاویر سه مدل پایه با کیفیت‌های متفاوت وجود دارند. ترجیح ما استفاده از مدل `flux-dev` برای کیفیت و قیمت به‌صرفه است.

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


برای ساختن مدل از ورودی‌ها، وارد Replicate می‌شویم و [lucataco/ai-toolkit](https://replicate.com/lucataco/ai-toolkit)‌را پیدا می‌کنیم. این جعبه‌ابزار فایلی برای ما می‌سازد که عبارت `chamran` را به مدل می‌فهماند. داخل صفحهٔ جدید تبِ Train را انتخاب می‌کنیم.

(داخل پرانتز: برای تِرِین مدل می‌توانید از [ostris/flux-dev-lora-trainer](https://replicate.com/ostris/flux-dev-lora-trainer/train) هم استفاده کنید؛ اما در زمان نگارش این مطلب امکان آپلود عکس به آن وجود ندارد.)

![](attachment/b0c49317ff386cab781944cf2e743b08.png)

برای مقدار `destination`، گزینهٔ `Create new model` را انتخاب می‌کنیم و اسم دلخواهی برای مدل خودمان انتخاب می‌کنیم. مثلاً من `flux-lora-character-chamran` را انتخاب کرده‌ام.

![](attachment/92b7e794cba1488c4fddd2f0ea5b2285.png)

در گام بعدی، فایل Zip عکس‌های انتخابی را آپلود می‌کنیم.

![](attachment/811804a58480a5064f420e404d2321d2.png)

برای مقدار `model_name`، همان `black-forest-labs/FLUX.1-dev` را دست‌نخورده باقی می‌گذاریم.

![](attachment/8a8852e7e0cb6ba23836342f4d7484be.png)

برای مقدار `hf_token`، باید به [صفحهٔ تنظیمات خود در سایت huggingface](https://huggingface.co/settings/profile) بروید. منوی `Access Tokens` را انتخاب کنید و گزینهٔ `Create New Token` را بزنید. برای تنظیمات محض اطمینان همهٔ تیک‌ها را مثل پایین بزنید و یک اسم دلخواه برایش انتخاب کنید.

![](attachment/d834fbe67204092c9263c63834c90da8.png)

بعد از فشردن دکمهٔ `Create Token` در انتهای صفحه، یک کُد به شما نمایش داده می‌شود که همان کد `hf_token` است. آن را کپی کنید و داخل فیلد `hf_token` در سایت Replicate قرار دهید.

![](attachment/8eb2e0100c11b208ab0ab6b8e1713922.png)

![](attachment/d22bede9ff99f15b9c08628fe1ebb085.png)

باقی تنظیمات را بجز آخری دست‌نخورده بگذارید. برای `repo_id`، باید دوباره به سایت huggingface برگردید و [یک مدل جدید بسازید](https://huggingface.co/new). این مدل میزبان خروجی سایت Replicate خواهد بود. بعد از وارد کردن اسم دلخواه، مطمئن شوید که مدل شما در حالت `Public` قرار دارد و آن بسازید.

![](attachment/bb18a7835a9bd872f419ade09c9388db.png)

بعد از ساخته شدن مدل، اسم آن را داخل فیلد `repo_id` به این شکل قرار دهید:

```
USERNAME/REPONAME
```

یعنی اول نام کاربری، بعد / و بعد هم نام مدل.

حالا با کلیک روی دکمهٔ `Create training`، مدل شما به مرور ساخته می‌شود. ساختن مدل چند ده دقیقه زمان می‌برد؛ اما شما می‌توانید روند آن را از طریق لاگی که در همان صفحه قرار دارد دنبال کنید. اگر هم اشکال خاصی در مراحل مرتکب شده باشید، در همان لاگ به اطلاع شما می‌رسد.

![](attachment/ab5fb184787aee6903d4dddc8392217c.png)

بعد از ساخته شدن مدل، Replicate آن را بر روی اکانت huggingface شما قرار می‌دهد. با اتمام این کار، حالا نوبت به ساختن تصاویر بر پایهٔ مدل می‌رسد.

![](attachment/949e2684d709acd07d406f3c61530e98.png)

## قدم سوم: ساختن تصاویر با مدل

برای ساختن تصویر از مدل روی Replicate به [lucataco/flux-dev-lora](https://replicate.com/lucataco/flux-dev-lora) بروید.

![](attachment/448b998c7bc2f1ff96938a72769b9414.png)

فیلدهای تولید عکس به این شرح است:

### فیلد `prompt`

دستوری است که برای ساخت عکس به مدل می‌دهید. این فیلد حداکثر ۷۷ توکن برای تولید عکس می‌پذیرد پس نوشتن پرامپت‌های خیلی طولانی کمک نمی‌کند. برای فراخوانی شخصیت‌های خود، به تجربه بهتر است در ابتدای پرامپت از آن‌ها نام ببرید تا انتهای پرامپت. برای بهتر شدن پرامپت همچنین می‌توانید از مدل‌های زبانی مثل ChatGPT و Claude هم استفاده کنید. مثلاً فرض کنید می‌خواهیم تصویری از شهید چمران در یک آزمایشگاه فیزیک تولید کنیم. من یک توصیف اولیه برای مدل زبانی می‌نویسم و از آن می‌خواهم که آن را برای من بهبود دهد:

```
Enhance this prompt for me to use in a AI image generator. Use 77 Tokens or less. Provide 5 alternate prompts for me to choose from:

<A quantum physicist in a labcoat doing experiments in a futuristic labaratory>
```

![](attachment/08315f3e158c936e214aab1d90bfcdd4.png)

از بین این پرامپت‌ها، یکی را که به نظرم بهتر است را انتخاب می‌کنم و توکن اختصاصی خودم (`chamran`) را در آن جا می‌دهم و آن را در فیلد `prompt` مدل می‌گذارم:

```
Chamran as a quantum physicist in a modern lab coat, performing intricate experiments in a high-tech futuristic lab, illuminated by glowing instruments and screens
```

### فیلد `aspect_ratio`

نسبت طول به عرض تصویر است. بسته به دلخواه قابل تنظیم است.

### فیلد `num_outputs`

تعداد تصاویر خروجی را مشخص می‌کند. از آن‌جایی که تولید هر عکس حدود ۲ هزار تومان آب می‌خورد، می‌توان تعداد بیشتری تولید کرد تا دستمان در انتخاب بهترین عکس بازتر باشد.

### فیلدهای `num_inference_steps` و `guidance_scale`

نیازی به تغییر این دو فیلد نیست. اولی برای تعداد مراحل نویزگیری از تصویر است و دومی اهمیت پرامپت را در تولید عکس نشان می‌دهد. مثلاً تصویر زیر تغییرات مقدار `guidance_scale` را در خروجی نشان می‌دهد. با افزایش مقدار این متغیر، تصاویر بیشتر بیشتر به سبک دوبعدی و با رنگ‌بندی دلخواه نزدیک می‌شوند. اما از حد گذراندن آن اکثراً جلوی خلاقیت مدل را می‌گیرد.

![[ch-guidance.jpg]]

```
chamran poster with a ak47 in his hands, standing at the top of a mountain with a red sun behind his head, 2d graphic is style of soviet propoganda
```

فیلد `num_of_inference_step` تعداد گام‌های تدقیق تصویر را تعیین می‌کند. مدل‌های تولید تصویر فعلی اکثراً از یک تصویر رندوم -مثل فریم اول ویدئوی پایین- شروع می‌کنند و به مرور نویززدایی از تصویر، به خروجی می‌رسند. عدد ۲۸ که پیش‌فرض مدل است، برای رسیدن به خروجی راضی‌کننده کافی است؛ اما اگر خروجی مطلوب شما نبود، این عدد را بالاتر ببرید تا مدل زمان بیشتری صرف ساختن عکس‌ها بکند.

![[cg_steps_flux.mp4]]

### فیلد `hf_lora`

آدرس `huggingface` مدلی که ساخته‌اید. بدون این مدل، `flux` شخصیتی به نام چمران را نمی‌شناسد. فرمت آن هم به این شکل است:

```
USERNAME/REPONAME
```

### فیلد lora_scale

وزن مدل شما در تولید تصویر. وزن ۱ بیشترین و وزن ۰ کمترین تعهد به مدل را دارد. مقدار ۰٫۸ برای آن مناسب است. چرا که گاهی اوقات با وزن ۱ علاوه بر چهره، لباس‌ها هم تکرار می‌شوند. اگر وزن ۰٫۸ خروجی‌های ناسازگاری به شما داد، بهتر است مقدار آن را دستکاری کنید.

![[lora_scales.jpg]]

```
chamran impressionist painting with a yellow wheat field behind him, in style of Vincent van Gogh, swirly brush strokes, impressionist art style, vibrant coloring, 8K
```

### فیلد seed

مقدار رندومی که عکس با آن تولید می‌شود. اگر به دنبال خروجی‌های تکراری هستید، `seed` و پرامپت‌های تکراری به مدل بدهید. در غیر این‌صورت آن را خالی بگذارید.

### فیلد output_format

بهتر است که مقدار آن را به `png` تغییر دهید.

### فیلد output_quality

اگر فرمت خروجی شما `png` هست، نیازی به تغییر این فیلد ندارید. در غیر این‌صورت برای داشتن بهترین خروجی آن را روی ۱۰۰ قرار دهید.


بعد از اعمال تنظیمات، دکمهٔ `Run` را بزنید. مدل در عرض چند ثانیه تصاویر با چهرهٔ انتخابی برای شما می‌سازد. 


![](attachment/4ba33131eddcb3869b77d4763b5408e6.png)


> [!tip] دستکاری متغیرها
> حوزهٔ تولید تصویر با هوش مصنوعی همچنان برای سازندگانش هم ناشناخته است. برای همین بهتر است برای رسیدن به خروجی دلخواه، فیلدها را بشناسید و با تغییر آن‌ها، به تصویر مطلوب خود نزدیک‌تر شوید. ویدئوهایی مثل [این](https://www.youtube.com/watch?v=WtmKyqi_aFM) که تأثیر فیلدها را با جزئیات بررسی می‌کنند، کمک بزرگی به رسیدن کاربر به تصویر مطلوبش می‌کنند.


خلق تصاویر مختلف نیازمند خلاقیت در ایجاد سناریوهاست و دستکاری متغیرهای مدل است. مدل‌های زبانی می‌توانند در خلق این سناریوها به ما کمک کنند.

![](attachment/7a68c099a49e30935df65a701148b408.png)

مقادیر فیلدهای استفاده شده در تولید عکس بالا:

```json
"input": {
    "prompt": "Chamran in white robes, standing in the heart of a vibrant field filled with multicolored flowers. In golden hours of the sky",
    "hf_lora": "Eledah/flux-lora-character-chamran",
    "lora_scale": 0.9,
    "num_outputs": 4,
    "aspect_ratio": "16:9",
    "output_format": "png",
    "guidance_scale": 3.5,
    "output_quality": 80,
    "num_inference_steps": 28
  },
```

علاوه بر مدل `flux-dev-lora`، می‌توانید از مدل [flux-dev-schnell](https://replicate.com/lucataco/flux-schnell-lora) هم استفاده کنید. این مدل به ازای هر عکس ۰٫۳ سنت خرج دارد؛ اما در عوض کیفیت عکس‌های خروجی‌اش پایین‌تر است. تصویر پایین، خروجی مدل `schnell` با تنظیماتی مشابه عکس بالاست.

![[ch6.jpg]]

## ضمیمه ۱: تمرین مدل با کد

اگر اهل برنامه‌نویسی هستید، کل مراحل بالا را می‌توان با کد پایتون هم انجام داد. بخش اول کد پایین، برای شما مدلی در سایت `replicate.com` با اسم انتخابی می‌سازد. برای این کار اول از همه باید `API_TOKEN` خودتان را برای سایت `Replicate` از [این صفحه](https://replicate.com/account/api-tokens) بردارید و داخل فایلی با نام `.env` در پوشهٔ کد قرار دهید. به این شکل:

```shell
REPLICATE_API_TOKEN=r8_PE*********************************
```

در بخش دوم، برنامه فایل ورودی `input.zip` را از شما می‌گیرد و آن را برای مدل می‌فرستد. برای خروجی مدل می‌توانید `huggingface` را برای میزبانی انتخاب کنید. در این صورت باید از قبل مدل را در `huggingface` بسازید و مشابه قبل `Access Token` آن را در داخل کد قرار دهید.

```python
import replicate
import os
from dotenv import load_dotenv

load_dotenv()

replicate.api_key = os.environ["REPLICATE_API_TOKEN"]

# Creating a model
model = replicate.models.create(
    owner="USERNAME",
    name="MODELNAME",
    visibility="public",  # or "private" if you prefer
    hardware="gpu-t4",
    description="A fine-tuned FLUX.1 model"
)

print(f"Model created: {model.name}")
print(f"Model URL: https://replicate.com/{model.owner}/{model.name}")


# Training Phase
training = replicate.trainings.create(
    version="ostris/flux-dev-lora-trainer:4ffd32160efd92e956d39c5338a9b8fbafca58e03f791f6d8011f3e20e8ea6fa",
    input={
        "input_images": open("input.zip", "rb"),
        "steps": 1000,
        "steps": 1000,
        "lora_rank": 16,
        "optimizer": "adamw8bit",
        "batch_size": 1,
        "resolution": "512,768,1024",
        "autocaption": True,
        "trigger_word": "HAJGH",
        "learning_rate": 0.0004,
        "hf_token": "HF_TOKEN",  # optional
        "hf_repo_id": "HF_REPO",  # optional
    },
    destination=f"{model.owner}/{model.name}"
)

print(f"Training started: {training.status}")
print(f"Training URL: https://replicate.com/p/{training.id}")
```

با پایان برنامه، مدل شما در `huggingface` قرار می‌گیرد و آمادهٔ استفاده می‌شود.

## ضمیمه ۲: بهینه‌سازی برای کاربران عادی

طی همهٔ این مراحل برای کاربر عادی نه صرفه‌ای دارد و نه ساده است. راهکار، استفاده از [API](https://replicate.com/lucataco/flux-dev-lora/api) سایت Replicate و بالا آوردن یک میانجیِ کاربرپسند است. به عنوان مثال برای طی این مراحل با پایتون کافیست با فرستادن فیلدهای درخواستی به سایت، خروجی را دریافت کرد:

```python
import replicate

input = {
    "prompt": "Chamran in white robes, standing in the heart of a vibrant field filled with multicolored flowers. In golden hours of the sky",
    "hf_lora": "Eledah/flux-lora-character-chamran",
    "lora_scale": 0.9,
    "num_outputs": 4,
    "aspect_ratio": "16:9",
    "output_format": "png",
    "guidance_scale": 3.5,
    "output_quality": 80,
    "num_inference_steps": 28
}

output = replicate.run(
    "lucataco/flux-dev-lora:a22c463f11808638ad5e2ebd582e07a469031f48dd567366fb4c6fdab91d614d",
    input=input
)

print(output)
#=> ["https://replicate.delivery/yhqm/U0JjGgdA6E4NBB8RRfSXv0q...
```

همهٔ این اقدامات کافیست در بک‌اند سایت انجام شود و کاربر  تنها مقادیر `aspect_ratio` و `prompt` را در فرانت تغییر دهد تا خروجی‌های خود را ببیند.
