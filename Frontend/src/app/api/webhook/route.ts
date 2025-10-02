import { NextResponse } from "next/server"

// Mock AI responses for testing markdown styling
const mockResponses = [
  {
    type: "contract_analysis",
    content: `# Contract Analysis Report

Based on my review of your employment contract, here are the **key findings**:

## Main Clauses

1. **Termination Clause**: The contract includes a 30-day notice period for both parties
2. **Non-Compete Agreement**: Restricts employment with competitors for 12 months
3. **Intellectual Property**: All work-related inventions belong to the company

## Areas of Concern

> **Important**: The non-compete clause may be overly restrictive depending on your jurisdiction.

### Recommendations

- Consider negotiating the non-compete period from 12 to 6 months
- Request clarification on the definition of "competitor"
- Ensure adequate severance provisions are included

## Code Example
Here's a sample clause amendment:

\`\`\`text
"The Employee agrees not to engage in competing business 
activities for a period of six (6) months following 
termination of employment."
\`\`\`

**Next Steps**: I recommend consulting with a local employment attorney for jurisdiction-specific advice.`
  },
  {
    type: "legal_research",
    content: `# Legal Research: Data Privacy Laws

## Overview

Data privacy regulations have evolved significantly in recent years. Here's what you need to know:

### Key Regulations

- **GDPR** (General Data Protection Regulation) - EU
- **CCPA** (California Consumer Privacy Act) - California, USA
- **PIPEDA** (Personal Information Protection and Electronic Documents Act) - Canada

## Compliance Requirements

1. **Data Collection**
   - Obtain explicit consent
   - Provide clear privacy notices
   - Implement purpose limitation

2. **Data Processing**
   - Ensure lawful basis exists
   - Maintain data accuracy
   - Implement security measures

3. **Individual Rights**
   - Right to access personal data
   - Right to rectification
   - Right to erasure ("right to be forgotten")

### Penalty Structure

| Violation Type | GDPR Fine | CCPA Fine |
|---------------|-----------|-----------|
| Minor | Up to €10M or 2% revenue | Up to $2,500 per violation |
| Major | Up to €20M or 4% revenue | Up to $7,500 per violation |

> **Pro Tip**: Start with a privacy-by-design approach to avoid costly compliance issues later.

## Implementation Checklist

- [ ] Conduct privacy impact assessment
- [ ] Update privacy policy
- [ ] Implement consent management
- [ ] Train staff on data handling
- [ ] Establish breach notification procedures

*Need help with compliance? Contact a privacy law specialist.*`
  },
  {
    type: "litigation_advice",
    content: `# Litigation Strategy Assessment

## Case Summary

Your breach of contract dispute involves the following elements:

### Strengths of Your Position

1. **Clear contractual terms** - The agreement explicitly states delivery timelines
2. **Documentation** - Email trail shows repeated delays and excuses
3. **Damages** - Quantifiable losses due to delayed performance

### Potential Challenges

- **Force Majeure Claims**: Defendant may argue COVID-19 impacts
- **Mitigation of Damages**: Court may question if you minimized losses
- **Statute of Limitations**: Ensure all claims are filed timely

## Recommended Strategy

### Phase 1: Pre-Litigation
- Send formal demand letter
- Attempt mediation
- Gather additional evidence

### Phase 2: Filing
\`\`\`markdown
**Key Documents Needed:**
- Original contract
- All correspondence
- Proof of damages
- Expert witness statements
\`\`\`

### Phase 3: Discovery
Expect the following timeline:
- **Months 1-3**: Initial discovery requests
- **Months 4-6**: Depositions and expert reports  
- **Months 7-9**: Trial preparation

## Cost-Benefit Analysis

| Scenario | Probability | Potential Recovery | Legal Costs |
|----------|-------------|-------------------|-------------|
| Settlement | 60% | $75,000 - $100,000 | $15,000 |
| Trial Win | 25% | $150,000 - $200,000 | $50,000 |
| Trial Loss | 15% | $0 | $50,000 + defendant's costs |

> **Recommendation**: Pursue settlement negotiations while preparing for trial.

**Next Steps**: Schedule a strategy session to discuss settlement parameters and trial timeline.`
  },
  {
    type: "simple_advice",
    content: `Thank you for your question about **tenant rights** in lease disputes.

Based on the information provided, here are the key points:

- Your landlord **cannot** enter without 24-hour notice except in emergencies
- The \`security deposit\` must be returned within 30 days of lease termination
- You have the right to request repairs in writing

## Quick Action Items:
1. Document all communications with your landlord
2. Take photos of any property damage
3. Review your local tenant protection laws

*Would you like me to explain any specific tenant rights in more detail?*`
  }
]

function getRandomResponse() {
  const randomIndex = Math.floor(Math.random() * mockResponses.length)
  return mockResponses[randomIndex].content
}

function simulateTypingDelay() {
  // Simulate realistic API response time (500ms to 2s)
  return new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Simulate API processing time
    await simulateTypingDelay()
    
    // For testing purposes, you can also create responses based on the input
    let response = getRandomResponse()
    
    // Optional: Generate contextual responses based on input keywords
    if (body.message) {
      const message = body.message.toLowerCase()
      if (message.includes('contract') || message.includes('agreement')) {
        response = mockResponses[0].content
      } else if (message.includes('privacy') || message.includes('data') || message.includes('gdpr')) {
        response = mockResponses[1].content
      } else if (message.includes('lawsuit') || message.includes('litigation') || message.includes('court')) {
        response = mockResponses[2].content
      } else if (message.includes('tenant') || message.includes('landlord') || message.includes('rent')) {
        response = mockResponses[3].content
      }
    }

    return NextResponse.json({ text: response })
  } catch (err) {
    console.error("Error generating mock response:", err)
    
    // Fallback response
    const fallbackResponse = `I apologize, but I'm experiencing some technical difficulties. 

However, I'm here to help with your legal questions. Please try asking again, and I'll do my best to provide you with accurate legal information and guidance.

**Common areas I can assist with:**
- Contract review and analysis  
- Employment law questions
- Tenant and landlord disputes
- Business formation guidance
- Intellectual property basics

*Please note: This is for informational purposes only and does not constitute legal advice.*`
    
    return NextResponse.json({ text: fallbackResponse })
  }
}
