---
title: ترکیب سبک و شخصیت با Flux
draft: false
tags: 
date: 2024-09-11 10:44
---
علاوه بر [[ساختن مدل و خلق تصویر با Flux|فهماندن چهره به مدل Flux]]، امکان فهماندن سبک‌های مختلف هنری هم به آن وجود دارد. خود مدل Flux Pro سبک بسیاری از هنرمندان را در خود دارد. جدا از اسم هنرمندان، مدل‌های `Flux Dev` و `Flux Schnell` بسیاری از سبک‌های هنری مثل «اکسپرسیونیسم» یا «رئالیسم» را می‌فهمند. بسیاری از سبک‌ها و نام هنرمندان در سایت‌های مشابه [این سایت](https://supagruen.github.io/StableDiffusion-CheatSheet/) به عنوان مرجع آمده است.

پس خیلی از اوقات بدون داشتن مدل دیگری بر پایهٔ سبک، می‌توان با پرامپتی ساده مدل‌های ضمنی موجود را فراخوانی کرد. مانند تصویر زیر:

![[image_20240911_105904_02790330-a964-4945-a8b3-87bc9294dccc.png|400]]

```
chamran face as pixel Art, blocky and vibrant, retro gaming aesthetics, in the style of classic 8-bit art, 8K
```

یا تصویر زیر:

![[image_20240911_113753_90b28d2d-535f-4547-aa0d-b937ff5fdab7.png|400]]

```
chamran portrait with a yellow wheat field behind him, in style of Vincent van Gogh, vibrant coloring, 8K
```

اما در صورتی که مدل با پرامپت‌های مختلف ما سبک هنری مدنظر را متوجه نشود یا اصلاً سبک به قدری ناشناخته باشد که در مدل نیامده باشد، چاره‌ای جز ترکیب [[Fine tuning|Fine tune]] کردن مدل و فهماندن سبک به آن نمی‌ماند. در اینجا راه ما برای انجام Finetuning، [[تکنیک LoRA]] است. همانطور که در وصف LoRA گفتیم، در این تکنیک مدل اصلی دست‌نخورده باقی می‌ماند و یک مدل جانبی با سرعتی بسیار بالا [[Training|آموزش]] داده می‌شود که خروجی آن در انتها با خروجی مدل اصلی جمع شده و خروجی نهایی را می‌سازد.

## آموزش سبک جدید به مدل

برای تمرین مدل Flux با تکنیک LoRA، مشابه آنچه در مطلب [[ساختن مدل و خلق تصویر با Flux]] آمده است عمل می‌کنیم. تعدادی از آثار هنری با سبک یکسان (بین ۲۰ تا ۴۰) را انتخاب می‌کنیم، در صورت لازم به آن‌ها کپشن می‌زنیم و مدلی تازه بر اساس آن‌ها می‌سازیم. برای این نمونه، من این نقاشی‌ها را از عبدالحمید قدیریان انتخاب کرده‌ام:

![[Pasted image 20240911115851.png]]

هر چقدر سبک آثار هنری نزدیک‌تر به هم باشد، نتیجهٔ بهتری هم خواهد داشت. مثلاً آقای قدیریان تعدادی مینیاتور با سبک‌های متفاوت هم دارند که به دلیل همبستگی مدل، آن‌ها را در مجموعهٔ مدل نیاوردم.

از اینجا به بعد تمامی مراحل مشابه [[ساختن مدل و خلق تصویر با Flux]] است. فقط اینکه بهتر است متغیرهای `learning_rate` و `steps` را برای یادگیری سبک تغییر دهید. مقدار `1.5e-4` برای `learning_rate` و قدم‌های بین ۱۵۰۰ تا ۳۰۰۰ برای این کار مناسب‌تر است. اگر هم عکس‌های شما کپشن ندارند، `autocaption` را خاموش کنید.

با انجام این مراحل و آماده شدن، مدل جدید روی سایت `huggingface` بارگذاری و آمادهٔ استفاده می‌شود. استفاده از آن هم مشابه استفاده از مدل‌های چهره است. کافیست در [lucataco/flux-dev-lora](https://replicate.com/lucataco/flux-dev-lora) در فیلد `hf_lora` آدرس مدل جدید را قرار دهید. پس از این با وارد کردن پرامپت جدید، عکسی با سبک مدنظر شما تولید خواهد شد:

![[image_20240911_121811_7852e602-35b3-4b5a-9add-117ed628f890.jpg]]

```
dreamlike GHADIRIAN painting of a tree in the middle of a flower field, blue and green color palette
```


![[image_20240911_122128_031e5ad7-ff5d-462c-9de8-ffdf16b06c3a.jpg]]

```
GHADIRIAN dreamlike painting of a white horse running in the desert, brown red and black color palette
```

![[image_20240911_122601_26c2e85b-6375-4594-99ae-86fe991b233d.jpg]]

```
GHADIRIAN dreamlike painting of an angel with wings rising to the sky, yellow and white color palette, masterpiece
```

## ترکیب سبک و شخصیت


با توجه به انعطاف تکنیک LoRA، امکان ترکیب چند مدل با هم به سادگی مهیاست. برای این کار کافیست که به [lucataco/flux-dev-multi-lora](https://replicate.com/lucataco/flux-dev-multi-lora) سر بزنید. با استفاده از این ابزار امکان ترکیب بیش از یک مدل LoRA با Flux مهیا می‌شود. برای معرفی مدل‌های LoRA کافیست آدرس آن‌ها را به ترتیب در فیلد `hf_loras` وارد کنید.

![[Pasted image 20240911131827.png]]

با وارد کردن سایر مقادیر طبق توضیحات داده شده در مطلب [[ساختن مدل و خلق تصویر با Flux]]، یک خروجی از ترکیب سبک و شخصیت خواهید داشت:

![[image_20240911_132229_5ad5b956-1323-43f7-bebc-f43f2686ca60.jpg]]

```
chamran in style of GHADIRIAN sitting in the middle of a flower field dressed in white robes, dreamlike vibarnt oil painting with flowing colors, green and yellow color palette
```

برای رسیدن به خروجی ایدئال، بهتر است متغیرهای [[ساختن مدل و خلق تصویر با Flux#فیلدهای num_inference_steps و guidance_scale|guidance_scale]] و [[ساختن مدل و خلق تصویر با Flux#فیلد lora_scale|lora_scales]] را در بازه‌های مختلف تغییر دهید و کم‌کم نقطهٔ تعادل بین مدل و شخصیت را پیدا کنید. مثلاً برای تولید تصویر بالا، مقادیر پایین به عنوان ورودی به مدل فرستاده شده‌اند:

```python
input = {
    "prompt": "chamran in style of GHADIRIAN sitting in the middle of a flower field dressed in white robes, dreamlike vibarnt oil painting with flowing colors, green and yellow color palette",
    "hf_loras": [
      "Eledah/flux-lora-character-chamran",
      "Eledah/flux-lora-style-ghadirian"
    ],
    "num_outputs": 4,
    "aspect_ratio": "16:9",
    "output_format": "png",
    "num_inference_steps": 28,
    "lora_scales": [
        0.8,
        0.9
    ],
    "guidance_scale": 2
  }
```

 
> [!warning] دربارهٔ تقلید چهره‌ها
> اگر شخص صاحب سبکی که قصد تقلید از آثارش را دارید پرتره‌های فراوانی نکشیده باشد، انتظار اجرای دقیق چهره را از مدل نداشته باشید. در این حالت می‌تواند سوژهٔ خود را در نمایی دورتر با جزئیاتی کمتر به تصویر بکشید


![[image_20240911_133308_265f8bf4-9ad5-4688-a8ab-8d221ae49f9d.jpg]]

```
chamran in style of GHADIRIAN rowing a boat in the middle of the ocean, dreamlike vibarnt oil painting with flowing colors, golden hour color palette
```

## استفاده از مدل‌های دیگران

علاوه بر مدل‌هایی که خود ما با تکنیک LoRA می‌سازیم، سبک‌های فراوان دیگری هم هستند که کاربران دیگر زحمت ساخت آن را کشیده‌اند. مثلاً مدل [mgwr/Cine-Aesthetic](https://huggingface.co/mgwr/Cine-Aesthetic) از سبک فیلم‌های سینمایی تقلید می‌کند:

![[image_20240911_135221_6ff3fbcd-f5e6-4deb-81f1-02307d086850.jpg]]

```
mgwr/cine, subway station, chamran in motion blur, city life, urban portrait, fleeting moment, subway train passing, melancholic mood, blurred movement, muted tones, cinematic style, mid-action capture, pensive expression, modern solitude, soft lighting, fleeting glance, public transport, reflective surfaces, contemporary photography, dynamic composition, speed and stillness contrast.
```

باز هم مثال ببینیم. مدل [multimodalart/flux-tarot-v1](https://huggingface.co/multimodalart/flux-tarot-v1) کارت تاروت طراحی می‌کند:

![[image_20240911_140234_fcc96583-f385-4c8b-b7a2-75ed32cc1d52.jpg|400]]

```
chamran holding an AK-47 in his hands, standing tall on top of a mountain with the red sun behind his head, "the warrior" in the style of TOK a trtcrd, tarot style
```

مدل‌های این‌چنینی فراوان هستند. مدل [veryVANYA/ps1-style-flux](https://huggingface.co/veryVANYA/ps1-style-flux) سبک گرافیک کنسول PS1 را روی ورودی‌ها اعمال می‌کند. خروجی مدل [kudzueye/Boreal](https://huggingface.co/kudzueye/Boreal) بی‌نهایت به عکس‌های روزمرهٔ ما نزدیک است. مدل [Norod78/Flux_1_Dev_LoRA_Paper-Cutout-Style](https://huggingface.co/Norod78/Flux_1_Dev_LoRA_Paper-Cutout-Style) عکس را به سبک کاردستی‌های کاغذی می‌سازد. مثل تصاویر پایین.

| ![[image_20240911_133644_001bbc15-17db-4aad-8be1-ea9649a85b8b.jpg]] | ![[image_20240911_134712_7b1bd42f-2e6b-4897-ac84-a94427bd0499.jpg]] |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- |

```
chamran, Paper Cutout Style
```

پس الزاماً نیاز به [[Training|آموزش]] مدل تازه‌ای برای سبک نیست. بسیاری از سبک‌ها به شکل ضمنی در مدل‌ها آمده‌اند. بخش دیگری از سبک‌ها هم توسط کاربران ساخته شده‌اند و قابل اعمال روی شخصیت‌های فعلی هستند. ساختن مدل جدید از سبک تنها در زمانی توصیه می‌شود که نه مدل اصلی و نه مدل‌های موجود پاسخگوی تقلید ما از سبک باشند.

## ضمیمه ۱: کدِ مورد نیاز برای تولید و ذخیرهٔ عکس

به خاطر داشته باشید که باید کد `API`‌ سایت `Replicate` را داخل پوشهٔ کد داخل فایلی با نام `.env` و به این شکل ذخیره کنید:

```shell
REPLICATE_API_TOKEN=r8_PE*********************************
```

اصلِ کد پایتون:

```python
import replicate
import os
import requests
from dotenv import load_dotenv

load_dotenv()

replicate.api_key = os.environ["REPLICATE_API_TOKEN"]

input = {
    "prompt": "chamran holding an AK-47 in his hands, standing tall on top of a mountain with the red sun behind his head, \"the warrior\" in the style of TOK a trtcrd, tarot style",
    "hf_loras": [
      "Eledah/flux-lora-character-chamran",
      "multimodalart/flux-tarot-v1"
    ],
    "num_outputs": 4,
    "aspect_ratio": "3:4",
    "output_format": "png",
    "num_inference_steps": 28,
    "lora_scales": [
        1,
        0.8
    ],
    "guidance_scale": 2.5,
    "disable_safety_checker": True
  }

output = replicate.run(
    "lucataco/flux-dev-multi-lora:a738942df15c8c788b076ddd052256ba7923aade687b12109ccc64b2c3483aa1",
    input=input
)

os.makedirs("outputs", exist_ok=True)

import uuid
import datetime

for i, image_url in enumerate(output):
    response = requests.get(image_url)
    if response.status_code == 200:
        unique_id = uuid.uuid4()
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"outputs/image_{timestamp}_{unique_id}.png"
        
        with open(filename, "wb") as f:
            f.write(response.content)
        print(f"Image {i+1} saved successfully as {filename}.")
    else:
        print(f"Failed to download image {i+1}.")
```