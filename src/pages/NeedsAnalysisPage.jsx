import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function NeedsAnalysisPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>

        {/* PROJECT HERO */}
        <section className="project-hero">
          <h2>Data and AI for Analysis &amp; Evaluation</h2>
          <div className="project-hero__image">
            <img src="/images/card-needs-analysis.png" alt="Owl eye close-up with data overlay" />
          </div>
          <div className="project-hero__text">
            <p>
              When deciding what learning intervention to create (or whether to create one at all), we are
              making resource allocation decisions. AI has become the go-to tool for researching, analyzing
              data, and informing those decisions. But it often presents findings that sound so credible that
              we forget AI is designed to pattern-match and create plausible outputs, which are not
              necessarily the truth.
            </p>
            <p>
              That's why I treat AI as a probabilistic assistant operating under audit and not some magic
              eight ball that spits out answers. And this work piece showcases a structured approach to
              AI-assisted analysis of large-scale qualitative data, forcing it to work with facts and leaving
              little to no room for it to "make sh#t up".
            </p>
          </div>
        </section>

        {/* ABOUT THIS WORK */}
        <section className="about-section">
          <h2>About This Work</h2>
          <p>
            The context of this work is about identifying knowledge gaps, specifically, gaps that cause users
            to depend on support or onboarding resources. In this example, I work with thousands of support
            ticket records to identify common themes, root causes, and resolutions while distinguishing
            between genuine knowledge gaps and other factors like product usability issues. The goal is to
            uncover recurring challenges that point to if and where learning interventions are actually
            needed.
          </p>
          <div className="disclaimer">
            <p>
              I conduct my analysis using company-provided tools with direct access to our internal database,
              and no company data is exported to external AI services.
            </p>
            <p>
              This work sample represents my individual design approach and methodology. It does not reflect
              the procedures, processes, or team practices of my current or former employers.
            </p>
          </div>
        </section>

        {/* THE METHODOLOGY */}
        <section className="deep-section deep-section--navy">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2>⚙️ The Methodology</h2>

            {/* STEP 1 */}
            <div style={{ marginBottom: '36px' }}>
              <div className="tab-content">
                <h3>Step 1: Ground the AI in Facts</h3>
                <h4 className="method-label">What</h4>
                <p>Make AI show it it can access and read the data before it does anything else.</p>
                <h4 className="method-label">Why</h4>
                <p>
                  I've watched AI confidently analyze data it couldn't actually read. It would give polished
                  responses that sounded right that were based on assumptions and expected patterns, not what
                  was actually in front of it.
                </p>
                <h4 className="method-label">How</h4>
                <p>
                  Before any analysis happens, I ask for one thing: record count. No insights, no patterns,
                  just "How many records are we looking at?". Because if it can't count them accurately, it
                  can't analyze them reliably.
                </p>
              </div>
              <div className="prompt-example">
                <h3>Prompt Example</h3>
                <p className="prompt-example__body">{`Do not do anything other than running the query below and return only the total number of records. Nothing more nothing less.
SELECT
    ticket_id,
    URL,
    subject,
    conversation
FROM
    operations.fact_chat_sessions
WHERE
    submission_date BETWEEN '2025-01-01' and '2025-06-30'
AND
    status = 'Resolved'

Do not perform any analysis, summarization, or additional actions. Just run this query and report the record count.`}</p>
              </div>
            </div>

            {/* STEP 2 */}
            <div style={{ marginBottom: '36px' }}>
              <div className="tab-content">
                <h3>Step 2: Test Capability at Small Scale</h3>
                <h4 className="method-label">What</h4>
                <p>
                  Have AI prove it can do the task on just five records while articulating its reasoning,
                  essentially sharpening its analytical approach before scaling up.
                </p>
                <h4 className="method-label">Why</h4>
                <p>
                  Seeing how it thinks, verify it can execute correctly, and building the right analytical
                  muscle before letting it loose on thousands of records. Because a bad approach doesn't get
                  better at scale, if it can't articulate sensible reasoning on a small sample, iut won't
                  suddenly figure it out on 50000 records.
                </p>
                <h4 className="method-label">How</h4>
                <p>
                  I narrow down the dataset from Phase 1 to a smaller timeframe, then ask AI to identify a
                  pattern from this sample and provide five supporting cases as evidence. But before it
                  executes, it must summarize what I'm asking in its own words and walk me through its planned
                  approach and reasoning. This forces AI to think through its logic and let me catch flawed
                  reasoning before it scales
                </p>
              </div>
              <div className="prompt-example">
                <h3>Prompt Example</h3>
                <p className="prompt-example__body">{`Do not do anything yet. Read the prompt in its entirety.

You will run the following query:

SELECT
    ticket_id,
    URL,
    subject,
    conversation
FROM
    operations.fact_chat_sessions
WHERE
    submission_date BETWEEN '2025-03-01' and '2025-03-15'
AND
    status = 'Resolved'

Then, use the query output to identify five distinct ticket_ids that share a common question or challenge by:
1. Returning how many records you get in return from this query.
2. Carefully analyzing BOTH the 'subject' and 'conversation' columns for each record.
3. Identifying a meaningful pattern or common issue across tickets.
4. Selecting exactly 5 distinct ticket_ids that exemplify this shared challenge.

You'll share your output that includes the following:
1. Common challenge/question. Provide a clear, concise description of the shared issue across all five tickets.
2. Resolution to this common challenge.
3. For each ticket_id, briefly explain why you think it shares the same challenge as the other four.
4. You will create a table with the following columns:
    1. ticket_id
    2. URL
    3. Supporting quote from the description that demonstrates the common issue
    4. English translation if the original is not in English, otherwise write "N/A"
    5. What's the most likely reason this case was raised. Is it a knowledge gap? Bad UX? Product limitation? Something else?

Can you summarize what I need in your own words? Then, write your steps and reasoning on how you would achieve that. DO NOT start the analysis yet.`}</p>
              </div>
            </div>

            {/* STEP 3 */}
            <div style={{ marginBottom: '36px' }}>
              <div className="tab-content">
                <h3>Step 3: Run Full Analysis with Guardrails</h3>
                <h4 className="method-label">What</h4>
                <p>
                  Let AI analyze the full dataset, but with clear instructions on what to do when it hits
                  processing limits.
                </p>
                <h4 className="method-label">Why</h4>
                <p>
                  AI has processing limits and will either fabricate data when it hits them or quietly skip
                  portions of the dataset. Neither is acceptable when we're trying to understand real
                  patterns. I needed it to handle large datasets honestly and not creatively.
                </p>
                <h4 className="method-label">How</h4>
                <p>
                  Now working with the full dataset from Phase 1, I ask AI to identify the three most common
                  patterns and provide at least 20 supporting cases for each. As importantly, I remind AI
                  upfront that it has processing limits and tell it exactly what to do when it can't handle
                  everytthing at once.
                </p>
              </div>
              <div className="prompt-example">
                <h3>Prompt Example</h3>
                <p className="prompt-example__body">{`Using the complete result set from the original query,

SELECT
    ticket_id,
    URL,
    subject,
    conversation
FROM
    operations.fact_chat_sessions
WHERE
    submission_date BETWEEN '2025-01-01' and '2025-06-30'
AND
    status = 'Resolved'

You will identify the THREE most common challenges or questions. The three challenges MUST be DISTINCT from each other and represent different root causes. Do NOT present variations of the same issue as separate challenges. You MUST analyze the FULL dataset. If the dataset is too large to process at once, you will process it in batches and combine the results.

Before presenting your findings, you will report:
1. Total number of records in the dataset.
2. Total number of records processed.
3. Number of batches used (if batching was required).
4. Approximate number of records per batch.

If sampling is used instead of full processing, you will:
1. Explain why sampling was necessary.
2. Describe how the sample was selected.
3. Provide the sample size.
4. Explain how the sample represents the full dataset.

You will share your output that includes the following:
1. Common challenge #1 with clear and concise description of the shared issue.
2. Resolution to this common challenge.
3. You will create an output table with:
    1. Case_id
    2. URL
    3. Supporting quote from the description that demonstrates the common issue.
    4. English translation if the original is not in English, otherwise write "N/A"
    5. What's the most likely reason this case was raised. Is it a knowledge gap? Bad UX? Product limitation? Something else?

Each identified challenge should have AT LEAST TWENTY supporting ticket_ids, the more the better. Most importantly, why do you think these cases are similar? What's the common thread?

Repeat the process for common challenge #2 and #3.

Your findings will be concluded with total cases in this analysis, count of cases per challenge, the percentage of each challenge from the total count.

You WILL:
1. Analyze the FULL dataset (all N records) using a systematic approach.
2. Focus on finding the MOST FREQUENT challenges.
3. Use batching or sampling if needed to stay within your limits.
4. Ensure ticket_ids for each challenge are a full representative of the dataset.
5. Read both 'subject' AND 'conversation' columns carefully.
6. Provide exact quotes that clearly demonstrate the issue.
7. Include translations for non-English content.

You WILL NOT:
1. Attempt to process all data at once if it exceeds your limits and you WILL NOT skip records without reporting them.
2. Select overlapping ticket_ids for the three challenges.
3. Force three challenges if fewer exist.
4. Fabricate or paraphrase quotes. Use exact text.
5. Use any emoji, filler phrases, and closing remarks. Every word you output MUST be necessary. If removing it would not reduce meaning or accuracy, omit it`}</p>
              </div>
            </div>

            {/* STEP 4 */}
            <div style={{ marginBottom: '36px' }}>
              <div className="tab-content">
                <h3>Step 4: Validate the Output</h3>
                <h4 className="method-label">What</h4>
                <p>
                  Manually verify a sample of case IDs and quotes against the actual source system to confirm
                  AI didn't fabricate or misrepresent evidence.
                </p>
                <h4 className="method-label">Why</h4>
                <p>
                  Even with good guardrails, AI can still get things wrong. It might present a ticket id that
                  does exist, cite a ticket that supports a different issue entirely or subtly mischaracterize
                  what the conversation was actually about.
                </p>
                <h4 className="method-label">How</h4>
                <p>
                  I select three to five ticket IDs per identified challenge and pull the actual tickets
                  directly from the source system. For each one, I verify three things:
                </p>
                <ol className="about-list about-list--light">
                  <li>Does the case exist?</li>
                  <li>Does the quote actually appear exactly as cited?</li>
                  <li>Does it support the claimed challenge?</li>
                </ol>
              </div>
            </div>

            {/* STEP 5 */}
            <div style={{ marginBottom: '36px' }}>
              <div className="tab-content">
                <h3>Step 5: Segment by Population</h3>
                <h4 className="method-label">What</h4>
                <p>
                  Depending on the situation, I sometimes I add another layer by segmenting users into groups.
                  For example, trained vs. untrained, English vs. Non-English speaking regions, tenure levels,
                  user roles, or any other relevant characteristic.
                </p>
                <h4 className="method-label">Why</h4>
                <p>
                  Different groups often experience different knowledge gaps. Trained users might show new
                  training opportunities, new users might struggle with concepts expereinced find obvious,
                  regional differences might present localization needs. Segmentation reveals whether existing
                  solutions are working for everyone or just some populations, what's still missing, and where
                  to focus next.
                </p>
                <h4 className="method-label">How</h4>
                <p>
                  The core structure stays the same, grounding in facts, testing at scale, validating outputs.
                  The additional instruction is in how to define the groups: what qualifies a user for a
                  segment, what conditions must be true at the time of the ticket, and how to handle edge
                  cases.
                </p>
              </div>
              <div className="prompt-example">
                <h3>Prompt Example of Comparing Trained Population</h3>
                <p className="prompt-example__body">{`Now, this is what I need:

1. Categorize support tickets by complexity level:
    If subcategory 'Getting Started' or 'Core Features' -> level is 'Basic'
    If subcategory 'People Analytics', 'Habit Formation', or 'Personal Development Tools' -> 'Intermediate'
    All others -> 'Advanced'
2. Pull user training status from owllocate.academy.dim_LearningContent
3. Categorize each ticket requestor using requestor_email as trained or untrained:
    Trained IF: is_trained is true AND trained_date is before ticket submission_date AND training_level matches ticket Level defined in step 1
    Else: Untrained
4. Run the same analysis on subject and conversation using the full dataset:
    Process in batches or use sampling if needed
    Explain your batching or sampling method
    Always conclude with total tickets processed and breakdown of trained vs. untrained population
5. Proceed with pattern identifiaction following the same standards and output table as before.`}</p>
              </div>
            </div>

            {/* STEP 6 */}
            <div style={{ marginBottom: '36px' }}>
              <div className="tab-content">
                <h3>Step 6: Triangulate with Other Data Sources</h3>
                <h4 className="method-label">What</h4>
                <p>Validate and expand finidngs by analyzing other data sources.</p>
                <h4 className="method-label">Why</h4>
                <p>
                  One data source can be wrong. Two can be a coincidence. But when support tickets, simulation
                  data, SME interview, and internal documentation all point to the same gap, it brings me the
                  confidence that I'm solving the right problem.
                </p>
                <h4 className="method-label">How</h4>
                <p>
                  I apply the same validation methodology to additional sources: simulation output data (if
                  available), internal documentation, Gong call recordings, or other relevant datasets. I also
                  often just ask Ai directly: "What other data sources or methods that I haven't considered?",
                  and this can surface angles I missed. This final step is about understanding where output
                  aligns or differs, and what that tells me about the actual problem.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* CTA CROSS-LINK */}

        <section className="cta-section">
          <h3>IS IT WORTH THE DEPTH?</h3>
          <p>
            Thorough analysis takes time, time that most learning teams don't feel they have.
            But the alternative is building content for a problem that was never quite right to begin with, then rebuilding once the results don't land.
          </p>
          <p>
            On average, the product training informed by this approach reduced support tickets by ~27%, with ongoing refinement continuing to drive this number.
            Hours spent on analysis upfront translated directly into fewer hours spent correcting course later.
          </p>
          <p>
            If you're interested in seeing how this needs analysis shaped the actual learning design and product training that followed, you can explore it in my Owllocate work piece.
          </p>
          <a href="/owllocate-get-started" className='btn-secondary'>
          Getting Started with Owllocate
          </a>
        </section>

      </main>
      <Footer />
    </div>
  );
}
