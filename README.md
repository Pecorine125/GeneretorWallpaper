# 🎨 Wallpaper Generator com Firebase + Replicate + Vercel

Este é um projeto completo de **gerador de wallpapers personalizados**, com suporte para imagens baseadas em texto, upload de imagem de referência, proteção para conteúdo +18, e painel de administração.

---

## 🚀 Funcionalidades

- Geração de wallpapers com base em texto e/ou imagem de referência
- Upload de imagens + checagem de conteúdo +18
- Registro e login com Firebase Authentication (Email/Senha)
- Validação de idade (data de nascimento)
- Bloqueio de conteúdo +18 para menores de idade
- Armazenamento de imagens geradas no Firestore por usuário
- Painel de administração para visualizar imagens geradas
- Blur automático para imagens +18
- Função Serverless para proteger a chave da API Replicate

---

## 🧱 Tecnologias usadas

- 🔥 Firebase Authentication & Firestore
- 🌐 HTML, CSS e JavaScript (moderno, ES Modules)
- 🎨 [Replicate](https://replicate.com/) – Geração de imagem via IA
- ☁️ Vercel – Deploy serverless + frontend
- 🔒 Proteção de chave via API interna (`/api/generate.js`)

---

## 📦 Estrutura de pastas

