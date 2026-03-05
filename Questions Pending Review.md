# Questions Pending Review
## A&A Cleaning — Review With Areli

Working review sheet for clarifying build decisions with Areli. Organized by when the answers are needed, not by topic.

**How to use this:**
- Work through Section 1 first — those answers affect what gets built and how.
- Check off each question as answered and write the answer inline.
- After the review, update `AA-Cleaning-Master-Spec.md` (Open Questions) and `AA-Cleaning-Implementation-Methodology.md` (Decision Log + External Dependency Register).
- Sections 2-3 can wait until after MVP build starts.
- Section 4 is for GCs and crew — not Areli.

---

# 1. ANSWER BEFORE BUILDING (Blocks architecture or design)

These directly affect how the platform is built. Without them, some tickets can't start.

### Device & Workflow

- [ ] **What device do you use most for work — phone, tablet, or laptop?**
  _Why:_ If phone-primary, the admin dashboard needs to be mobile-first. If laptop, desktop-first.
  **Answer:**


- [ ] **What's the bare minimum info you need to dispatch a job? (e.g., client name, address, date — anything else always required?)**
  _Why:_ The MVP form starts with only truly required fields. Everything else is optional.
  **Answer:**

### Crew Access

- [ ] **Do all crew members have smartphones with working cameras and data plans? If not, who are the exceptions?**
  _Why:_ The entire employee portal depends on this. Need to plan SMS fallback for anyone without a smartphone.
  _Note: Previous answer identified Samsung A12, Moto G, Pixel 4a as crew phones — confirm this is still accurate and covers everyone._
  **Answer:**

- [ ] **Which 1-2 crew members are most tech-comfortable and would be good pilot testers?**
  _Why:_ Soft launch works better with early adopters, not resisters.
  **Answer:**

### Crew Workflow



  for the crew , project name, type of clean, rough clean, final clean , touch up clean, every one of those cleans has a detail list that needs to be done, some of them will do windows or tubs, 

  first final clean / second final clean (same thing , details are the same, it depends because sometimes there may be other workers the first final clean isnt left perfect but the second one is)

  final clean: bath tubs (this includes the walls the bath tub inside and out,)

  address

### Financial Setup

- [ ] **Is your QuickBooks Desktop or Online?**
  _Why:_ Desktop has a different (worse) API. If Desktop, you'd need to migrate to Online before we can connect it to the platform. This blocks all of Phase 4.
  **Answer:**
  the quickbooks is online and she has the subscription

- [ ] **How do you price jobs: flat fee, per unit, per square foot, hourly, or a mix depending on the job?**
  _Why:_ Invoice generation logic changes completely based on this. If mixed, we need the form to support multiple pricing modes.
  **Answer:** she charges by feet then she adds a percentage for herself , a margin for herself.  For cleaning its by feet, her biggest thing is exterior windows. -- sometimes she includes the rental of tools like a midlift. sometimes the bid will have a whole total amount for everything. 

- [ ] **What are your usual payment terms with GCs — net 30, net 60, due on receipt, or varies by client?**
  _Why:_ Affects client records, invoice templates, and overdue alerts.
  **Answer:**
  all of the work is 30 days , new construction homes would be weekly or two weeks. Not in construction - it could be a month or two monthts, hud projects are the governemnet and it takes a while to pay out. For invoices yes. 



### Website Trust

- [ ] **Do you have general liability insurance and/or bonding? Do you want that displayed on the website?**
  _Why:_ GCs look for this. Showing it builds instant credibility. Hiding it raises questions.
  **Answer:**
  she has liability insurance, its a requirement, it covers for painting , wide ranging cleaning insurance, workers comp, general liability 


### Brand & Domain

- [ ] **Do you want to keep the name "A&A Cleaning" or are you open to something more premium-sounding? (e.g., "A&A Facility Care," "A&A Standards")**
  _Why:_ Affects domain purchase, logo, all branding materials. Decide before building the site.
  **Answer:**
yes
- [ ] **Do you have a domain already, or should we register one? Any preference? (e.g., aacleaningaustin.com, aandfacilitycare.com)**
  _Why:_ Need this before the site goes live. Also needed for email deliverability setup (SPF, DKIM, DMARC).
  **Answer:**

- [ ] **Do you have a logo, or do we need to create one?**
  _Why:_ The site, completion reports, and business cards all need it. Can start with a clean text-based monogram and upgrade later.
  **Answer:**

---

# 2. ANSWER DURING BUILD (Shapes features but doesn't block starting)

These affect specific features. Get answers before reaching that part of the build.

### Job Creation & Scheduling

- [ ] **How far in advance are jobs usually scheduled — same day, next day, weekly, or it varies?**
  _Why:_ Affects whether we need urgency flags and same-day dispatch features.
  **Answer:**
  construction is scheduled in a week in advance, move out units - sometimes its an emergency and would be the same day, construction per contract should be a week , within the same week. at least 3 days in advance - its always a day before that she dispatches 

- [ ] **How often do jobs change last minute (crew sick, site not ready, other trade delayed)?**
  _Why:_ If frequent, reassignment and notifications need to be fast and easy.
  **Answer:**
  sick crew , site not ready , its more the people that may be inconsistent. 

- [ ] **Are most jobs single-visit, or do multi-day / multi-unit jobs happen often enough to matter now?**
  _Why:_ If multi-day is rare, we keep the data model simple (tag/group field). If common, we build the full project entity earlier.
  **Answer:**
  the jobs are per building so it depends on how big it is, it also depends on the clean, the least that they stay in a building is three days, sometimes there are companies that might want it quicker, normal is three days 

### QA & Completion

- [ ] **After the crew finishes, what do you need to see before you'd feel confident telling the GC the work is done?**
  _Why:_ Defines what "QA approval" really means in practice — photos only? Photos + walkthrough? Just trust certain workers?
  **Answer:**
  they just walk it at their own pace - whenever the GC has time 

- [ ] **What types of photos do you most want from completion: whole room shots, problem areas, before/after, close-ups of specific surfaces?**
  _Why:_ Shapes photo guidance we give crew and what you look for during review.
  **Answer:**

- [ ] **Is 3-5 photos per job realistic for crew, or is that too many?**
  _Why:_ Need to keep the completion flow under 30 seconds. If 3-5 is too many, we start with fewer.
  **Answer:**

- [ ] **If you flag a job as needing rework, how should crew find out — app notification, text, phone call, all three?**
  _Why:_ Affects notification design for the needs-rework flow.
  **Answer:**

- [ ] **When a job has issues but is mostly acceptable, should it still be billable? Or does any issue need to be fully resolved first?**
  _Why:_ Confirms whether "flagged" jobs can be invoiced and reported, or only "approved" ones.
  **Answer:**

### Issue Reporting

- [ ] **When crew sees something unexpected on-site (paint in tub, damage from other trades), how do they tell you now — text, call, photo, or wait?**
  _Why:_ The platform's issue reporting should feel faster than what they do now, not more work.
  **Answer:**
  they take a picture and send it to her

- [ ] **What kinds of disputes or callbacks happen most often?**
  _Why:_ Helps us prioritize which evidence (photos, notes, timestamps) matters most for real disputes.
  **Answer:**

### Lead Intake & Follow-Up Workflow

The website will capture quote requests and send you an immediate alert. But we need to nail down exactly how you want to handle those leads when they come in. This shapes the entire booking pipeline.

- [ ] **When a new lead comes in from the website, how do you want to follow up — phone call, text, or email?**

  _Why:_ This determines the entire lead response system. The platform can be optimized for whichever channel you prefer.

  **Option A: Phone Call First (Recommended)**
  - You get an SMS alert with the lead's name, company, and phone number
  - You call them back directly — aim for within 15 minutes during business hours
  - Fastest way to qualify the job, build trust, and close
  - In construction, the first sub to call back usually gets the conversation
  - Downside: Requires you to be available to make calls throughout the day
  
Answer: my mom would prefer to call potential clients, she can provide additional information so that she could get more on what they need and the work required, what they want and let them know how long it would take and how much it would be, she could even go to the job site, and walk the area. 

  **Option B: Text First**
  - You get an SMS alert and respond via text to the lead's number
  - Good for quick initial contact when you're on a job site and can't talk
  - Can transition to a call once you have a moment
  - Downside: Harder to close over text — conversations drag, context gets lost

  **Option C: Email First**
  - You get an email notification and respond with a professional email
  - Good for detailed quotes and documentation
  - Downside: Slowest response channel. GCs may not check email frequently. You lose the personal touch that wins jobs.
  
  Sometimes she will send the estimate out through email so this could be a good secondary channel. 

  **Option D: Hybrid — Call + Text Backup**
  - SMS alert comes in → you call immediately
  - If no answer, you send a quick text: "Hi [Name], this is Areli from A&A Cleaning. I just tried calling about your [service type] request. When's a good time to connect?"
  - Covers both bases — shows responsiveness even if they don't pick up

  **Our lean: Option A or D.** Phone calls close deals in this industry. GCs want to hear confidence and competence, not read it in an email. The text backup in Option D makes sure no lead goes cold just because someone didn't answer.

  **Answer:**

- [ ] **How quickly can you realistically return a call to a new lead during the work day?**
  _Why:_ We'll set follow-up reminder timers based on your answer. If you can call back in 15 minutes, great. If you're often on-site and can't call for 2 hours, we adjust the alert timing.
  _Options:_ Within 15 minutes / Within 1 hour / Within 2 hours / End of day / Varies wildly
  **Answer:**

- [ ] **What hours are you available to take or return calls from potential clients?**
  _Why:_ Leads submitted outside these hours get a different auto-acknowledgment ("We'll call you first thing in the morning") and your SMS alert is tagged as non-urgent.
  **Answer:**

- [ ] **When a new GC reaches out, what info do you try to get from them first?**
  _Why:_ Shapes the intake form fields and the qualifying questions you ask on the call. We want the form to capture the basics so your call is focused on closing, not gathering basic info.
  **Answer:**
  name of the company , phone number and email, and the job that is going to be done

- [ ] **Do you always visit the site before quoting, or do you sometimes quote from photos/description alone?**
  _Why:_ Affects whether the quote flow requires site visit photos or can work from client-submitted info. If you sometimes quote from description alone, we can make the quote creation faster for those cases.
  **Answer:**

  not always , unless its something major, or a major contract

- [ ] **How do you currently create estimates — QuickBooks, Excel, handwritten, verbal over the phone, or a mix?**
  _Why:_ The platform will have a built-in quote creator with branded PDF output. We need to know what it's replacing so it feels faster, not slower.
  **Answer:**
  quickbooks 

- [ ] **Do you want quotes texted, emailed, or both to the potential client?**
  _Why:_ The platform can send the quote PDF via email and/or text a link to view it online. GCs in construction often prefer text for speed, but email creates a paper trail.
  **Answer:**
  email and text - could be a pdf file through text

- [ ] **When a lead goes quiet after you've quoted, how do you follow up now? How many times before you give up?**
  _Why:_ The system can auto-remind you to follow up at intervals you choose (3 days, 7 days, etc.). Need to match your natural rhythm so the reminders feel helpful, not nagging.
  **Answer:**
  she never has the issue, but we could follow up within 3 days 


- [ ] **How do you want to be notified about new leads — text message, phone notification, email, or some combination?**
  _Why:_ The default is SMS (instant). But if you'd also like an email with the full details, or a dashboard alert you check periodically, we can layer notifications.
  **Answer:**
  text 


### Internal Notes

- [ ] **What kind of private notes do you keep about clients or jobs that crew and clients should never see?**
  _Why:_ Validates the `notes_internal` field — and helps us understand what should be private vs shared.
  **Answer:**

---

# 3. ANSWER BEFORE PHASE 2+ (Can wait until MVP is running)

### Client Communication

- [ ] **Which 2-3 GC contacts would you ask whether they'd use a completion report portal or prefer email/PDF?**
  _Why:_ We need real validation before spending weeks building a client portal. If GCs prefer email, we skip the portal entirely.
  **Answer:**
she works on a timeline so they expect it to be done by then if not she lets them know. So if its three days then they expect it to be done by that third day 
- [ ] **Would you want completion reports sent automatically after you approve, or do you want to review and hit "Send" each time?**
  _Why:_ Affects automation level. If you want control, it's a "Send Report" button. If you trust the system, it auto-sends on approval.
  **Answer:**

- [ ] **Are you comfortable showing crew names on completion reports that GCs see?**
  _Why:_ Transparency vs privacy tradeoff. The spec recommends yes (builds trust), but it's your call.
  **Answer:**

### Training & Resource Library

- [ ] **What are the 5-8 most important job types or cleaning standards you'd want documented first?**
  _Why:_ These become the first cleaning guides in the resource library. An empty library is worse than no library.
  **Answer:**
  hold off on this one it might take too much time to build out 

- [ ] **Would you be willing to talk through your process for each job type while someone records/transcribes it?**
  _Why:_ Fastest way to create guides — you talk, we structure it. If not, we need a different content plan.
  **Answer:**

### Billing Details

- [ ] **Does every job get a formal estimate, or only larger projects / new clients?**
  _Why:_ Affects whether the quote workflow is core to every job or just for new leads. The platform now has a built-in quote creator — if every job gets one, it's part of the standard flow. If only new clients, it's lead-pipeline only.
  **Answer:**
  not often providing estimates currently, the clients are already known - depending on what it is and what type of work it is, if its an apartment or office she has to go walk it first, if its units she already knows the price for that, the office you cant do it because it depends on whats in it, if it has 5 rooms inside, power washes

- [ ] **What triggers invoicing — crew completion, your approval, GC signoff, or end-of-week batching?**
  _Why:_ Defines when the system should generate/send invoices.
  **Answer:**
  normally the invoices are done once a week , whatever work is done by that week gets sent out 

- [ ] **Who receives invoices at the GC's end — the PM, office admin, owner, or AP department?**
  _Why:_ Affects client contact model and who gets emails.
  **Answer:**
  she would send the invoices to the manager, in construction its different , she has to go into a website and do everything through there. 

- [ ] **Do you ever bill a project in stages, or always one invoice at the end?**
  _Why:_ Matters for multi-day/multi-unit project billing.
  **Answer:**
  Everything is billed monthly, and whatever you have done per that month is billed 

- [ ] **Are late payments a real problem? If yes, for which types of clients?**
  _Why:_ If yes, the financial dashboard should prioritize invoice aging and overdue alerts.
  **Answer:**
  Yes more for construction 

### Website Content & Marketing

- [ ] **Which services do you most want featured on the website?**
  _Why:_ Determines service pages and homepage messaging.
  **Answer:**
  commercial cleaning, new construction (multifamily, commercial, offices, schools) move in move out apartemnts

  power wash , windows

- [ ] **Do you want the website to position A&A as Austin-only, Central Texas, or broader?**
  _Why:_ Affects SEO strategy and copy.
  **Answer:**
  service: san marcos, kyle, buda, georgetown, austin, roundrock, pflugerville huto 

- [ ] **Do you have usable job photos (before/after, completed sites) for the website?**
  _Why:_ Real photos >> stock photos. If none exist, we start collecting from upcoming jobs.
  **Answer:**

- [ ] **Which GC relationships are strong enough to ask for a testimonial?**
  _Why:_ One good testimonial on the homepage is worth more than ten service descriptions.
  **Answer:**
  there are a couple that could provide testimonial 

- [ ] **What action do you most want the website to drive: phone call, form submission, or both?**
  _Why:_ Determines the primary CTA on every page. Based on the booking pipeline design, we're leaning toward **phone call as primary CTA + quote request form as secondary.** The form ensures nothing falls through the cracks when you can't answer, but the phone call is where deals close.
  _Our recommendation:_ Both — "Call Now" button (click-to-call on mobile) as the hero CTA, with "Request a Quote" form as the secondary path. Every page has both options visible.
  **Answer:**

- [ ] **What phone, email, and address should appear publicly on the site?**
  _Why:_ Needs to be consistent across website, Google Business Profile, and all directories (NAP consistency matters for SEO).
  **Answer:**
  AAcleaningservices@outlook.com 

- [ ] **Do you have a Facebook, LinkedIn, or Google Business Profile already?**
  _Why:_ If yes, we link them. If no Google Business Profile, creating one is high-priority for local SEO.
  **Answer:**

- [ ] **Who manages social media long-term — you, someone else, or nobody?**
  _Why:_ If nobody will post regularly, we don't build the strategy around social. A dead LinkedIn page is worse than no page.
  **Answer:**

### Supply & Inventory

- [ ] **Do workers currently ask for supplies in any structured way, or is it all informal?**
  _Why:_ If informal and working fine, inventory management stays deferred to Phase 5.
  **Answer:**
  she provides the supplies, there is no tracking that she does related to that

---

# 4. QUESTIONS FOR CREW (Not Areli)

These are better answered by the actual end users. Areli can help pick who to ask and either relay the questions or introduce you.



### For 2-3 Crew Members (Pilot Users)

_Do this informally on a job site or over a quick call. Use Spanish._

- [ ] **Would you rather open an app or just get a text with the job address and details?**
  _Direct adoption signal._
  **Answer:**

- [ ] **If you got a text with a 6-digit code to log in, would that be easy or annoying?**
  _Validates Phone OTP login before building it._
  **Answer:**

- [ ] **Is taking 3-5 photos at the end of every job realistic, or is that too much?**
  _Confirms completion flow is feasible in real conditions._
  **Answer:**

- [ ] **Do you usually have good enough cell signal at job sites to upload photos?**
  _If signal is often bad, we need aggressive offline/retry support._
  **Answer:**

- [ ] **What would confuse you most about using an app for work updates?**
  _Reveals UX risks we haven't thought of._
  **Answer:**

---

# 5. CONTENT COLLECTION CHECKLIST

These aren't decision questions — they're things Areli needs to provide or help create for the website. Tackle once Section 1 questions are answered and the build has started.

- [ ] **Company description** — 1-2 strong paragraphs about what A&A does and why. _(About page + homepage.)_
- [ ] **Differentiator statement** — What makes A&A better than other cleaning subs? _(Headline copy.)_
- [ ] **Process description** — How a job goes from first call to final walkthrough, in simple terms. _(Services/process page.)_
- [ ] **Quality promise** — A standard or promise she'd put publicly on the website. _(Homepage credibility.)_
- [ ] **Hiring profile** — What kind of workers she's looking for: experience, transportation, language, schedule. _(Employment application page.)_
- [ ] **Portfolio photos** — 5-10 photos of completed job sites. _(Website portfolio section.)_
- [ ] **Business hours** — If she wants them listed publicly. _(Contact page + Google Business Profile.)_

---

# SUGGESTED CONVERSATION ORDER

Don't try to cover everything in one sitting. Break it into 2-3 short conversations:

**Conversation 1 (15-20 min):** Section 1 — device, workflow, crew access, QuickBooks, pricing, brand/domain.
_This is the most important conversation. Everything else can wait._

**Conversation 2 (15 min):** Section 2 — job scheduling, QA expectations, photos, issue reporting, lead intake.
_Do this once the build has started and you're working on these specific features._

**Conversation 3 (10 min):** Sections 3 + 5 — client communication preferences, website content inputs, training willingness.
_Do this when approaching Phase 2 or when website copy is needed._

**Separately:** Section 4 — GC and crew questions happen informally, not in a sit-down review.

---

# AFTER COLLECTING ANSWERS

1. Update the External Dependency Register in `AA-Cleaning-Implementation-Methodology.md` (Section 6.3)
2. Update Open Questions in `AA-Cleaning-Master-Spec.md` (Part 8)
3. Log any decisions that change locked assumptions in the Decision Log (Methodology Section 5)
4. Turn confirmed answers into execution packs and tickets


Notes: there is a sense that some of the employees bring their personal issues to the job, they might be on their phone while working or doing things that while distracted could be dangerous. 


The contract gets to the job site, there is a manager that distributes the work through email or text, so it seems that this all comes from working with companies

they will say i have a building for this date, will this be possible or doable, my mom then just texts with them directly 

there are about 5 different companies, there are companies that deal with the outside or companies that deal with the inside and my mom deals more with the inside companies 

getting back to them should be quickly , doing the work could potentially be in a week depending on what it is 

she does have before and after photos

she doesnt want to work in residential, occupied, 

visualization dashboard for budgeting for her to track costs, profits and expenses. 

she also sends photos back to them about what they misssed or what they need to address. this especially happens with sub contractors. 