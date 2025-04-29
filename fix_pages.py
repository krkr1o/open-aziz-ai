import os
import re

# 1. إعدادات أساسية
OLD_PAGES_DIR = "pages"  # مجلد الصفحات القديم (إذا كان موجوداً)
NEW_BASE_URL = "https://krkr1o.github.io/open-aziz-ai/"
HTML_FILES = [
    "index.html", "Assistantcodes.html", "Chat.html", "Chat2.html", 
    "Chat3.html", "Codesfile.html", "Contactus.html", "Contactus2.html",
    "Controlpanel.html", "dashboard.html", "Designs.html", "documentation.html",
    "Forum.html", "generator.html", "login.html", "Myprofile.html", "policy.html",
    "privacy.html", "Problemsolving.html", "Projects.html", "Publishprojects.html",
    "register.html", "TermsandConditions.html", "Whoweare.html"
]

# 2. تصحيح أسماء الملفات (إزالة مسافات وأخطاء)
def fix_filenames():
    for filename in os.listdir('.'):
        if filename.endswith('.html'):
            new_name = filename.replace(' ', '').strip()
            if new_name != filename:
                os.rename(filename, new_name)
                print(f"تم تغيير: {filename} → {new_name}")

# 3. تحديث الروابط الداخلية
def update_links():
    for filename in HTML_FILES:
        if not os.path.exists(filename):
            continue
            
        with open(filename, 'r+', encoding='utf-8') as file:
            content = file.read()
            
            # أ. تحديث الروابط القديمة (مثل pages/...)
            content = re.sub(r'href=["\']pages/([^"\']+)\.html["\']', 
                            r'href="\1.html"', content)
            
            # ب. إضافة الروابط المطلقة للاستخدام في GitHub Pages
            content = content.replace('href="', f'href="{NEW_BASE_URL}')
            content = content.replace('src="', f'src="{NEW_BASE_URL}')
            
            # ج. إصلاح الروابط المزدوجة (إذا حدث خطأ)
            content = content.replace(f'{NEW_BASE_URL}{NEW_BASE_URL}', NEW_BASE_URL)
            
            file.seek(0)
            file.write(content)
            file.truncate()
        
        print(f"تم تحديث: {filename}")

# 4. إنشاء ملف README.md للتوثيق
def create_readme():
    readme_content = f"""# open-aziz-ai

مستودع مشروع Open Aziz AI

## كيفية الوصول إلى الصفحات

| الصفحة | الرابط |
|--------|--------|
"""
    for filename in HTML_FILES:
        if os.path.exists(filename):
            readme_content += f"| {filename} | [{filename}]({NEW_BASE_URL}{filename}) |\n"

    with open("README.md", "w", encoding="utf-8") as file:
        file.write(readme_content)
    print("تم إنشاء README.md")

# التنفيذ
if __name__ == "__main__":
    print("جاري معالجة الملفات...")
    fix_filenames()
    update_links()
    create_readme()
    print("تمت العملية بنجاح! يمكنك الآن رفع التغييرات إلى GitHub.")
