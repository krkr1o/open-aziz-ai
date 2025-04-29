
function sendMessage() {
  const input = document.getElementById('userInput');
  alert('سيتم إرسال السؤال: ' + input.value);
  // هنا يتم الدمج مع API الحقيقي لاحقًا
}


function sendMessage() {
  const input = document.getElementById('userInput');
  alert('سيتم إرسال السؤال: ' + input.value);
  // هنا يتم الدمج مع API الحقيقي لاحقًا
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  input.disabled = true;

  fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=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", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userMessage }] }]
    })
  })
  .then(res => res.json())
  .then(data => {
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم يتم العثور على رد.";
    alert("رد Gemini:
" + reply);
    input.disabled = false;
    input.value = "";
  })
  .catch(err => {
    console.error(err);
    alert("حدث خطأ أثناء الاتصال بـ Gemini.");
    input.disabled = false;
  });
}



    document.addEventListener('DOMContentLoaded', async () => {
      // Initialize code editor
      await window.codeEditor.init('code-editor', {
        language: 'javascript',
        value: `// مرحباً بك في ملعب الأكواد
// يمكنك كتابة وتشغيل الكود هنا

function مرحبا() {
  return "مرحباً بك في CyberAI OS!";
}

console.log(مرحبا());`
      });

      // Set up language selector
      const languageSelector = document.getElementById('language-selector');
      languageSelector.addEventListener('change', () => {
        window.codeEditor.setLanguage(languageSelector.value);
      });

      // Set up run button
      const runButton = document.getElementById('run-button');
      const outputContent = document.getElementById('output-content');

      runButton.addEventListener('click', () => {
        const code = window.codeEditor.getValue();
        const language = languageSelector.value;

        outputContent.innerHTML = '';

        if (language === 'javascript') {
          try {
            // Capture console.log output
            const originalConsoleLog = console.log;
            const logs = [];

            console.log = function(...args) {
              logs.push(args.map(arg => {
                if (typeof arg === 'object') {
                  return JSON.stringify(arg, null, 2);
                }
                return String(arg);
              }).join(' '));
              originalConsoleLog.apply(console, args);
            };

            // Execute code
            const result = new Function(code)();

            // Restore console.log
            console.log = originalConsoleLog;

            // Display logs
            logs.forEach(log => {
              const logElement = document.createElement('div');
              logElement.textContent = log;
              outputContent.appendChild(logElement);
            });

            // Display result if any
            if (result !== undefined) {
              const resultElement = document.createElement('div');
              resultElement.textContent = '=> ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : result);
              resultElement.style.color = 'var(--color-accent)';
              resultElement.style.marginTop = '10px';
              outputContent.appendChild(resultElement);
            }
          } catch (error) {
            const errorElement = document.createElement('div');
            errorElement.textContent = 'خطأ: ' + error.message;
            errorElement.style.color = 'red';
            outputContent.appendChild(errorElement);
          }
        } else if (language === 'html') {
          // Create iframe for HTML preview
          const iframe = document.createElement('iframe');
          outputContent.innerHTML = '';
          outputContent.appendChild(iframe);

          // Write HTML to iframe
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          iframeDoc.open();
          iframeDoc.write(code);
          iframeDoc.close();
        } else {
          outputContent.textContent = 'تشغيل الكود متاح حالياً فقط للغة JavaScript و HTML';
        }
      });

      // Set up save button
      const saveButton = document.getElementById('save-button');
      saveButton.addEventListener('click', async () => {
        if (!window.auth.isAuthenticated()) {
          alert('يجب تسجيل الدخول لحفظ الكود');
          return;
        }

        try {
          const code = window.codeEditor.getValue();
          const language = languageSelector.value;
          const userId = window.auth.getUserId();

          const projectId = await window.database.saveProject(userId, {
            name: 'مشروع ' + new Date().toLocaleString('ar'),
            language,
            code,
            createdAt: new Date().toISOString()
          });

          alert('تم حفظ الكود بنجاح');

          // Log activity
          window.database.logUserActivity(userId, 'project_saved', { projectId });
        } catch (error) {
          console.error('Failed to save code:', error);
          alert('فشل حفظ الكود: ' + error.message);
        }
      });

      // Set up share button
      const shareButton = document.getElementById('share-button');
      shareButton.addEventListener('click', () => {
        const code = window.codeEditor.getValue();
        const language = languageSelector.value;

        // Encode code and language for URL
        const encodedCode = encodeURIComponent(code);
        const encodedLanguage = encodeURIComponent(language);

        // Create share URL
        const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodedCode}&lang=${encodedLanguage}`;

        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('تم نسخ رابط المشاركة إلى الحافظة');
        }).catch(err => {
          console.error('Failed to copy share URL:', err);
          alert('فشل نسخ رابط المشاركة: ' + err.message);
        });
      });

      // Set up AI assist button
      const aiAssistButton = document.getElementById('ai-assist-button');
      aiAssistButton.addEventListener('click', () => {
        // Show AI assistance menu
        const menu = document.createElement('div');
        menu.className = 'ai-assist-menu';
        menu.style.position = 'absolute';
        menu.style.top = (aiAssistButton.getBoundingClientRect().bottom + 5) + 'px';
        menu.style.left = aiAssistButton.getBoundingClientRect().left + 'px';
        menu.style.backgroundColor = 'var(--color-card)';
        menu.style.border = '1px solid var(--color-border)';
        menu.style.borderRadius = '5px';
        menu.style.padding = '5px 0';
        menu.style.zIndex = '1000';
        menu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';

        const options = [
          { label: 'إكمال الكود', action: () => window.codeEditor.getAICodeCompletion() },
          { label: 'شرح الكود', action: () => window.codeEditor.getAICodeExplanation() },
          { label: 'تحسين الكود', action: () => aiImproveCode() },
          { label: 'تصحيح الأخطاء', action: () => aiFixCode() },
          { label: 'إضافة تعليقات', action: () => aiAddComments() }
        ];

        options.forEach(option => {
          const item = document.createElement('div');
          item.textContent = option.label;
          item.style.padding = '8px 15px';
          item.style.cursor = 'pointer';
          item.style.transition = 'background-color 0.2s';

          item.addEventListener('mouseover', () => {
            item.style.backgroundColor = 'var(--color-background)';
          });

          item.addEventListener('mouseout', () => {
            item.style.backgroundColor = 'transparent';
          });

          item.addEventListener('click', () => {
            document.body.removeChild(menu);
            option.action();
          });

          menu.appendChild(item);
        });

        document.body.appendChild(menu);

        // Close menu when clicking outside
        const closeMenu = (e) => {
          if (!menu.contains(e.target) && e.target !== aiAssistButton) {
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
          }
        };

        // Delay adding the event listener to prevent immediate closing
        setTimeout(() => {
          document.addEventListener('click', closeMenu);
        }, 100);
      });

      // AI functions
      async function aiImproveCode() {
        if (!window.secureAPI) {
          alert('خدمة الذكاء الاصطناعي غير متاحة');
          return;
        }

        try {
          const code = window.codeEditor.getValue();
          const language = languageSelector.value;

          // Show loading indicator
          const loadingWidget = window.codeEditor.showLoadingWidget();

          // Get improved code from AI
          const prompt = `حسّن الكود التالي (${language}):

\`\`\`
${code}
\`\`\`

قم بتحسين الكود من حيث الأداء والقراءة والصيانة. أعد كتابة الكود المحسن فقط بدون أي شرح إضافي.`;

          const improvement = await window.secureAPI.callGemini(prompt);

          // Hide loading indicator
          window.codeEditor.hideLoadingWidget(loadingWidget);

          // Extract code from response
          let improvedCode = improvement.text;
          // Remove markdown code blocks if present
          improvedCode = improvedCode.replace(/```[\w]*\n/g, '').replace(/```$/g, '');

          // Set improved code
          window.codeEditor.setValue(improvedCode);
        } catch (error) {
          console.error('Failed to improve code:', error);
          alert('فشل تحسين الكود: ' + error.message);
        }
      }

      async function aiFixCode() {
        if (!window.secureAPI) {
          alert('خدمة الذكاء الاصطناعي غير متاحة');
          return;
        }

        try {
          const code = window.codeEditor.getValue();
          const language = languageSelector.value;

          // Show loading indicator
          const loadingWidget = window.codeEditor.showLoadingWidget();

          // Get fixed code from AI
          const prompt = `صحح الأخطاء في الكود التالي (${language}):

\`\`\`
${code}
\`\`\`

قم بتصحيح أي أخطاء في الكود وأعد كتابة الكود المصحح فقط بدون أي شرح إضافي.`;

          const fix = await window.secureAPI.callGemini(prompt);

          // Hide loading indicator
          window.codeEditor.hideLoadingWidget(loadingWidget);

          // Extract code from response
          let fixedCode = fix.text;
          // Remove markdown code blocks if present
          fixedCode = fixedCode.replace(/```[\w]*\n/g, '').replace(/```$/g, '');

          // Set fixed code
          window.codeEditor.setValue(fixedCode);
        } catch (error) {
          console.error('Failed to fix code:', error);
          alert('فشل تصحيح الكود: ' + error.message);
        }
      }

      async function aiAddComments() {
        if (!window.secureAPI) {
          alert('خدمة الذكاء الاصطناعي غير متاحة');
          return;
        }

        try {
          const code = window.codeEditor.getValue();
          const language = languageSelector.value;

          // Show loading indicator
          const loadingWidget = window.codeEditor.showLoadingWidget();

          // Get commented code from AI
          const prompt = `أضف تعليقات توضيحية للكود التالي (${language}):

\`\`\`
${code}
\`\`\`

أضف تعليقات مفيدة تشرح ما يفعله الكود وكيف يعمل. أعد كتابة الكود مع التعليقات فقط بدون أي شرح إضافي.`;

          const commented = await window.secureAPI.callGemini(prompt);

          // Hide loading indicator
          window.codeEditor.hideLoadingWidget(loadingWidget);

          // Extract code from response
          let commentedCode = commented.text;
          // Remove markdown code blocks if present
          commentedCode = commentedCode.replace(/```[\w]*\n/g, '').replace(/```$/g, '');

          // Set commented code
          window.codeEditor.setValue(commentedCode);
        } catch (error) {
          console.error('Failed to add comments:', error);
          alert('فشل إضافة تعليقات: ' + error.message);
        }
      }

      // Check for shared code in URL
      const urlParams = new URLSearchParams(window.location.search);
      const sharedCode = urlParams.get('code');
      const sharedLanguage = urlParams.get('lang');

      if (sharedCode && sharedLanguage) {
        window.codeEditor.setValue(decodeURIComponent(sharedCode));
        languageSelector.value = decodeURIComponent(sharedLanguage);
        window.codeEditor.setLanguage(decodeURIComponent(sharedLanguage));
      }
    });
  

    document.addEventListener('DOMContentLoaded', async () => {
      // Check if user is logged in
      await window.auth.init();
      
      if (!window.auth.isAuthenticated()) {
        // Redirect to login page
        window.location.href = '../login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
      }
      
      // Initialize project manager
      await window.projectManager.init();
      
      // Load user projects
      loadProjects();
      
      // Set up new project button
      const newProjectBtn = document.getElementById('new-project-btn');
      const newProjectModal = document.getElementById('new-project-modal');
      const newProjectForm = document.getElementById('new-project-form');
      
      newProjectBtn.addEventListener('click', () => {
        newProjectModal.style.display = 'flex';
      });
      
      // Set up import project button
      const importProjectBtn = document.getElementById('import-project-btn');
      const importFileInput = document.getElementById('import-file-input');
      
      importProjectBtn.addEventListener('click', () => {
        importFileInput.click();
      });
      
      importFileInput.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
          try {
            const file = e.target.files[0];
            await window.projectManager.importProject(file);
            loadProjects();
            alert('تم استيراد المشروع بنجاح');
          } catch (error) {
            console.error('Import error:', error);
            alert('فشل استيراد المشروع: ' + error.message);
          }
          
          // Reset file input
          importFileInput.value = '';
        }
      });
      
      // Set up modal close buttons
      document.querySelectorAll('.modal-close, .modal-cancel').forEach(button => {
        button.addEventListener('click', () => {
          document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
          });
        });
      });
      
      // Set up new project form
      newProjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('project-name').value;
        const template = document.getElementById('project-template').value;
        
        try {
          await window.projectManager.createProject(name, template);
          newProjectModal.style.display = 'none';
          loadProjects();
          alert('تم إنشاء المشروع بنجاح');
        } catch (error) {
          console.error('Create project error:', error);
          alert('فشل إنشاء المشروع: ' + error.message);
        }
      });
      
      // Load projects function
      async function loadProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        const emptyState = document.getElementById('empty-state');
        
        try {
          const projects = await window.projectManager.getUserProjects();
          
          // Check if there are projects
          if (Object.keys(projects).length === 0) {
            projectsGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
          }
          
          // Hide empty state
          emptyState.style.display = 'none';
          
          // Clear projects grid
          projectsGrid.innerHTML = '';
          
          // Add projects
          Object.entries(projects).forEach(([id, project]) => {
            const card = createProjectCard(id, project);
            projectsGrid.appendChild(card);
          });
        } catch (error) {
          console.error('Load projects error:', error);
          alert('فشل تحميل المشاريع: ' + error.message);
        }
      }
      
      // Create project card function
      function createProjectCard(id, project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        // Get file count
        const fileCount = Object.keys(project.files || {}).length;
        
        // Format dates
        const createdAt = new Date(project.createdAt).toLocaleDateString('ar');
        const updatedAt = new Date(project.updatedAt).toLocaleDateString('ar');
        
        card.innerHTML = `
          <div class="project-header">
            <h3>${project.name}</h3>
          </div>
          <div class="project-content">
            <div class="project-meta">
              <div>القالب: ${getTemplateName(project.template)}</div>
              <div>${fileCount} ملفات</div>
            </div>
            <div class="project-meta">
              <div>تاريخ الإنشاء: ${createdAt}</div>
              <div>آخر تحديث: ${updatedAt}</div>
            </div>
            <div class="project-actions">
              <button class="btn btn-outline view-project" data-id="${id}">عرض</button>
              <button class="btn delete-project" data-id="${id}">حذف</button>
            </div>
          </div>
        `;
        
        // Add event listeners
        card.querySelector('.view-project').addEventListener('click', () => {
          showProjectDetails(id);
        });
        
        card.querySelector('.delete-project').addEventListener('click', async () => {
          if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
            try {
              await window.projectManager.deleteProject(id);
              loadProjects();
              alert('تم حذف المشروع بنجاح');
            } catch (error) {
              console.error('Delete project error:', error);
              alert('فشل حذف المشروع: ' + error.message);
            }
          }
        });
        
        return card;
      }
      
      // Get template name function
      function getTemplateName(templateId) {
        const templates = window.projectManager.getTemplates();
        return templates[templateId]?.name || templateId;
      }
      
      // Show project details function
      async function showProjectDetails(projectId) {
        try {
          // Load project
          const project = await window.projectManager.loadProject(projectId);
          
          // Set modal title
          document.getElementById('project-details-title').textContent = project.name;
          
          // Set project metadata
          document.getElementById('project-created-at').textContent = new Date(project.createdAt).toLocaleDateString('ar');
          document.getElementById('project-updated-at').textContent = new Date(project.updatedAt).toLocaleDateString('ar');
          
          // Set project files
          const filesListElement = document.getElementById('project-files-list');
          filesListElement.innerHTML = '';
          
          Object.entries(project.files || {}).forEach(([path, content]) => {
            const fileElement = document.createElement('div');
            fileElement.className = 'project-file';
            
            // Get file icon based on extension
            const extension = path.split('.').pop();
            const icon = getFileIcon(extension);
            
            fileElement.innerHTML = `
              <img src="${icon}" alt="${extension}" class="file-icon">
              <span>${path}</span>
            `;
            
            filesListElement.appendChild(fileElement);
          });
          
          // Set project deployments
          const deploymentsElement = document.getElementById('project-deployments');
          
          if (project.deployments && project.deployments.length > 0) {
            deploymentsElement.innerHTML = '';
            
            project.deployments.forEach(deployment => {
              const deploymentElement = document.createElement('div');
              deploymentElement.className = 'deployment-item';
              
              const deploymentDate = new Date(deployment.createdAt).toLocaleDateString('ar');
              
              deploymentElement.innerHTML = `
                <a href="${deployment.url}" target="_blank" class="deployment-url">${deployment.url}</a>
                <span class="deployment-date">${deploymentDate}</span>
              `;
              
              deploymentsElement.appendChild(deploymentElement);
            });
          } else {
            deploymentsElement.innerHTML = `
              <div class="empty-state">
                <p>لم يتم نشر هذا المشروع بعد</p>
              </div>
            `;
          }
          
          // Set up action buttons
          document.getElementById('edit-project-btn').dataset.id = projectId;
          document.getElementById('export-project-btn').dataset.id = projectId;
          document.getElementById('deploy-project-btn').dataset.id = projectId;
          
          // Show modal
          document.getElementById('project-details-modal').style.display = 'flex';
        } catch (error) {
          console.error('Show project details error:', error);
          alert('فشل عرض تفاصيل المشروع: ' + error.message);
        }
      }
      
      // Set up project details action buttons
      document.getElementById('edit-project-btn').addEventListener('click', () => {
        const projectId = document.getElementById('edit-project-btn').dataset.id;
        // Redirect to code editor with project ID
        window.location.href = 'ملعب-الأكواد.html?project=' + projectId;
      });
      
      document.getElementById('export-project-btn').addEventListener('click', async () => {
        const projectId = document.getElementById('export-project-btn').dataset.id;
        
        try {
          await window.projectManager.exportProject(projectId);
        } catch (error) {
          console.error('Export project error:', error);
          alert('فشل تصدير المشروع: ' + error.message);
        }
      });
      
      document.getElementById('deploy-project-btn').addEventListener('click', async () => {
        const projectId = document.getElementById('deploy-project-btn').dataset.id;
        
        try {
          const deployment = await window.projectManager.deployProject(projectId);
          alert(`تم نشر المشروع بنجاح على الرابط: ${deployment.url}`);
          
          // Reload project details
          showProjectDetails(projectId);
        } catch (error) {
          console.error('Deploy project error:', error);
          alert('فشل نشر المشروع: ' + error.message);
        }
      });
      
      // Get file icon function
      function getFileIcon(extension) {
        const icons = {
          html: '../images/file-icons/html.svg',
          css: '../images/file-icons/css.svg',
          js: '../images/file-icons/js.svg',
          json: '../images/file-icons/json.svg',
          md: '../images/file-icons/md.svg',
          txt: '../images/file-icons/txt.svg'
        };
        
        return icons[extension] || '../images/file-icons/file.svg';
      }
    });
  

    // Toggle sidebar on mobile
    document.getElementById('menu-toggle').addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('active');
    });

    // Usage Chart
    const usageCtx = document.getElementById('usageChart').getContext('2d');
    const usageChart = new Chart(usageCtx, {
      type: 'line',
      data: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
          label: 'استخدامات النظام',
          data: [1200, 1900, 3000, 5000, 6000, 8721],
          backgroundColor: 'rgba(230, 0, 0, 0.2)',
          borderColor: 'rgba(230, 0, 0, 1)',
          borderWidth: 2,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#e60000'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#e60000'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#e60000'
            }
          }
        }
      }
    });

    // Performance Chart
    const perfCtx = document.getElementById('performanceChart').getContext('2d');
    const performanceChart = new Chart(perfCtx, {
      type: 'bar',
      data: {
        labels: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        datasets: [{
          label: 'عدد الاستخدامات',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: 'rgba(230, 0, 0, 0.7)',
          borderColor: 'rgba(230, 0, 0, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#e60000'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#e60000'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#e60000'
            }
          }
        }
      }
    });
  

    function generate() {
      const title = document.getElementById("title").value;
      const desc = document.getElementById("desc").value;
      const code = document.getElementById("code").value;
      const html = `
<!DOCTYPE html>
<html lang="ar">
<head><meta charset="UTF-8"><title>${title}</title>
<style>
body { background-color: #000; color: #ff0033; font-family: monospace; padding: 20px; }
pre { background: #111; padding: 15px; overflow-x: auto; }
button { background: #ff0033; border: none; color: white; padding: 8px 12px; margin-bottom: 20px; cursor: pointer; }
footer { margin-top: 40px; font-size: 0.8em; color: #777; text-align: center; }
</style>
</head>
<body>
<h1>${title}</h1>
<p>${desc}</p>
<button onclick="navigator.clipboard.writeText(document.getElementById('code-block').innerText).then(() => alert('تم النسخ!'));">نسخ السكربت</button>
<pre><code id="code-block">${code}</code></pre>
<footer>تم الإنشاء تلقائيًا بواسطة المِزّة - عبدالعزيز | الأمن السيبراني</footer>
</body></html>
      `;
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      document.getElementById("output").innerHTML = `تم إنشاء الصفحة: <a href="${url}" download="${title}.html" style="color:#ff0033;">تحميل الملف</a>`;
    }

    function sendToTelegram() {
      alert("جاري إرسال الصفحة إلى تيليجرام عبر المِزّة...");
      // لاحقًا يتم الربط مع API أو webhook
    }
  

    document.addEventListener('DOMContentLoaded', () => {
      const loginForm = document.getElementById('login-form');
      const errorDiv = document.getElementById('auth-error');
      const successDiv = document.getElementById('auth-success');
      
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
        
        try {
          // Disable the submit button during login
          const submitButton = loginForm.querySelector('button[type="submit"]');
          submitButton.disabled = true;
          submitButton.textContent = 'جاري تسجيل الدخول...';
          
          // Call the login method from the auth manager
          const user = await window.auth.login(email, password);
          
          // Show success message
          successDiv.textContent = 'تم تسجيل الدخول بنجاح! جاري تحويلك...';
          successDiv.style.display = 'block';
          
          // Redirect to dashboard after successful login
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1500);
        } catch (error) {
          // Show error message
          errorDiv.textContent = error.message || 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.';
          errorDiv.style.display = 'block';
          
          // Re-enable the submit button
          const submitButton = loginForm.querySelector('button[type="submit"]');
          submitButton.disabled = false;
          submitButton.textContent = 'تسجيل الدخول';
        }
      });
    });
  

    document.addEventListener('DOMContentLoaded', () => {
      const registerForm = document.getElementById('register-form');
      const errorDiv = document.getElementById('auth-error');
      const successDiv = document.getElementById('auth-success');
      
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsChecked = document.getElementById('terms').checked;
        
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
        
        // Validate form
        if (password !== confirmPassword) {
          errorDiv.textContent = 'كلمات المرور غير متطابقة';
          errorDiv.style.display = 'block';
          return;
        }
        
        if (!termsChecked) {
          errorDiv.textContent = 'يجب الموافقة على الشروط والأحكام وسياسة الخصوصية';
          errorDiv.style.display = 'block';
          return;
        }
        
        try {
          // Disable the submit button during registration
          const submitButton = registerForm.querySelector('button[type="submit"]');
          submitButton.disabled = true;
          submitButton.textContent = 'جاري إنشاء الحساب...';
          
          // Call the register method from the auth manager
          const user = await window.auth.register(email, password, username);
          
          // Show success message
          successDiv.textContent = 'تم إنشاء الحساب بنجاح! جاري تحويلك...';
          successDiv.style.display = 'block';
          
          // Redirect to dashboard after successful registration
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1500);
        } catch (error) {
          // Show error message
          errorDiv.textContent = error.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.';
          errorDiv.style.display = 'block';
          
          // Re-enable the submit button
          const submitButton = registerForm.querySelector('button[type="submit"]');
          submitButton.disabled = false;
          submitButton.textContent = 'إنشاء حساب';
        }
      });
    });
  
