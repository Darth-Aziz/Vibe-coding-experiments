# Tasheel — GitHub Setup & Development Workflow

## 1. Repository Setup

Your repo: `https://github.com/Darth-Aziz/Vibe-coding-experiments`

### Initial Setup (one time)

```bash
# Clone your repo
git clone https://github.com/Darth-Aziz/Vibe-coding-experiments.git
cd Vibe-coding-experiments

# Create the project inside the repo
npx create-next-app@latest tasheel --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Move into the project
cd tasheel

# Install core dependencies
npm install zustand
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install bpmn-js bpmn-js-properties-panel @bpmn-io/properties-panel camunda-bpmn-moddle
npm install lucide-react
npm install date-fns

# Initialize shadcn/ui
npx shadcn-ui@latest init
# Choose: New York style, Slate base color, CSS variables: yes

# Add shadcn components (run each one)
npx shadcn-ui@latest add button card input label select table tabs badge dialog dropdown-menu separator toast sheet command popover calendar checkbox radio-group textarea switch avatar tooltip progress

# Verify it runs
npm run dev
# Open http://localhost:3000 — should see Next.js default page

# Initial commit
git add .
git commit -m "feat: initialize Tasheel project with dependencies"
git push origin main
```

### Project Structure After Setup

```
Vibe-coding-experiments/
└── tasheel/
    ├── app/
    ├── components/
    │   └── ui/          # shadcn components live here
    ├── lib/
    ├── public/
    ├── node_modules/
    ├── package.json
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── next.config.js
```

---

## 2. Development Workflow

### Daily Workflow

```bash
# Navigate to project
cd Vibe-coding-experiments/tasheel

# Start dev server (keep this terminal open)
npm run dev

# Open Cursor in the project folder
# Start building with the prompts from 02-cursor-prompts.md
```

### Commit Strategy

Commit after each major phase:

```bash
# After Prompt 0 (setup)
git add . && git commit -m "feat: project setup, types, store, mock data"

# After Prompt 1 (navigation)
git add . && git commit -m "feat: root layout, admin sidebar, requester nav"

# After Prompt 2 (dashboard + service list)
git add . && git commit -m "feat: admin dashboard and service list"

# After Prompt 3 (service create/edit)
git add . && git commit -m "feat: service creation and editing"

# After Prompt 4 (form builder)
git add . && git commit -m "feat: drag-and-drop form builder"

# After Prompt 5 (BPMN workflow)
git add . && git commit -m "feat: BPMN workflow designer with bpmn-js"

# After Prompt 6 (requester catalog + forms)
git add . && git commit -m "feat: requester portal, catalog, dynamic forms"

# After Prompt 7 (request tracking)
git add . && git commit -m "feat: request tracking with workflow status"

# After Prompt 8 (polish)
git add . && git commit -m "feat: polish, loading states, full flow verified"

# Push everything
git push origin main
```

---

## 3. Pre-Demo Setup

### The Night Before

```bash
cd Vibe-coding-experiments/tasheel

# Make sure main is clean
git status  # should be clean
npm run dev  # should start without errors

# Run through the full flow once:
# Admin: create service → build form → design workflow → publish
# Requester: browse → submit request → view tracker

# Create the demo branch
git checkout -b demo/live-session
git push origin demo/live-session

# Go back to main
git checkout main
```

### 30 Minutes Before the Session

```bash
cd Vibe-coding-experiments/tasheel

# Fresh start
git checkout main
git pull origin main
git checkout -b demo/live-session

# Start dev server
npm run dev

# Open these in your browser:
# Tab 1: http://localhost:3000 (Tasheel)
# Tab 2: https://github.com/Darth-Aziz/Vibe-coding-experiments (to show the branch)

# Open Cursor with the project folder
```

---

## 4. On Stage Workflow

### Step 1: Show the app running
```
Open browser → localhost:3000 → walk through admin and requester portals
```

### Step 2: Show safe branching
```bash
# In terminal, show the audience:
git branch  # show you're on demo/live-session
git log --oneline -5  # show commit history
```

### Step 3: Make live changes in Cursor
```
Use the modification prompts from 02-cursor-prompts.md (Prompt 9)
```

### Step 4: Show the changes
```
Browser auto-refreshes. Walk through the modification.
```

### Step 5: Commit and push
```bash
git add .
git commit -m "demo: added new feature live on stage"
git push origin demo/live-session
```

### Step 6: Show it on GitHub
```
Switch to GitHub tab → show the demo/live-session branch → show the commit
"This is what I'd hand to my developers. Not a PRD. A working prototype on a safe branch."
```

### Step 7: Clean up
```bash
git checkout main
git branch -D demo/live-session
git push origin --delete demo/live-session
```

---

## 5. Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm run dev` fails | Delete `node_modules` and `.next`, run `npm install` again |
| Port 3000 in use | `npx kill-port 3000` or use `PORT=3001 npm run dev` |
| bpmn-js CSS not loading | Check that CSS imports are in the workflow page or layout |
| Zustand state corrupted | Clear localStorage in browser devtools |
| Git push rejected | `git pull origin main --rebase` then push again |
| Cursor not seeing files | Close and reopen Cursor in the project folder |
| Browser not refreshing | Hard refresh: Cmd+Shift+R |

---

## 6. Important Notes

- **Never push to main during the demo.** Always use a feature branch.
- **localStorage persists data.** If you need to reset mock data, clear browser storage.
- **bpmn-js is heavy.** First load of the workflow designer page may take 2-3 seconds. That's normal.
- **The repo is public.** Don't commit any real company data or credentials.
- **Cursor works best with clean code.** Keep the codebase organized so AI modifications are predictable.
