# Tasheel V2 Agent Scoring Rubric

## Scale
- 5.0: Exceptional, production-grade, no material gaps
- 4.5: Strong, minor refinements only
- 4.0: Acceptable, some quality debt
- 3.5: Risky, requires rework before handoff
- <3.5: Blocking quality failure

## Global Scoring Dimensions
All agents are scored on:
1. Output Quality (20%)
2. Requirement Alignment (20%)
3. Technical Correctness (20%)
4. Risk Awareness (15%)
5. Handoff Clarity (15%)
6. Domain Excellence (10%)

Passing thresholds:
- Weighted score >= 4.2
- No critical dimension < 3.5

## Agent-Specific Critical Dimensions
- Sultan: Requirement Alignment, Risk Awareness
- Noura: Output Quality, Domain Excellence
- Fahd: Technical Correctness, Handoff Clarity
- Yaser: Technical Correctness, Requirement Alignment
- Dana: Domain Excellence, Technical Correctness
- Mashari: Domain Excellence, Technical Correctness
- Tariq: Risk Awareness, Handoff Clarity
- Reem: Domain Excellence, Risk Awareness
- Basel: Risk Awareness, Technical Correctness
- Haifa: Requirement Alignment, Risk Awareness
- Lama: Output Quality, Handoff Clarity
- Saad: Technical Correctness, Risk Awareness

## Scoring Template (Per Step)
```markdown
## Step Scorecard - [Agent]
Feature: [name]
Step: [N]

- Output Quality:
- Requirement Alignment:
- Technical Correctness:
- Risk Awareness:
- Handoff Clarity:
- Domain Excellence:

Weighted Score:
Verdict Band: Elite / Pass / Needs Rework / Block
Gate Result: PASS / FAIL

Top Strengths:
- ...

Top Gaps:
- ...

Required Rework (if fail):
- ...
```
