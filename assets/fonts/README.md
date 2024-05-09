# introduction
- this is keep custom fonts used for backup purpose

# how to add custom fonts
- select your fonts from https://fonts.google.com/
- download font file , example "NotoSansJP-VariableFont_wght.ttf"
- work with Devops to upload font file to s3 assets bucket, "/fonts/pdf/example1.ttf",
- update your lambda environment variable, "PULSIFI_ASSETS_PDF_CUSTOM_FONTS", example: "example1.ttf, example2.ttf"