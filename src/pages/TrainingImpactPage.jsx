import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

function ZoomableImage({ src, alt, crop }) {
  const [zoomed, setZoomed] = useState(false);
  return (
    <>
      <div className={`zoomable-img${crop ? ' zoomable-img--crop' : ''}`} onClick={() => setZoomed(true)}>
        <img src={src} alt={alt} />
        <span className="zoom-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="14.5" y2="14.5" />
            <line x1="7" y1="5" x2="7" y2="9" />
            <line x1="5" y1="7" x2="9" y2="7" />
          </svg>
        </span>
      </div>
      {zoomed && (
        <div className="zoom-overlay" onClick={() => setZoomed(false)}>
          <img src={src} alt={alt} />
        </div>
      )}
    </>
  );
}

function Accordion({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`accordion${open ? ' open' : ''}`}>
      <button className="accordion__header" onClick={() => setOpen(o => !o)}>
        <span className="accordion__label"> {label}</span>
        <span className={`accordion__chevron${open ? ' open' : ''}`}>▾</span>
      </button>
      {open && <div className="accordion__body">{children}</div>}
    </div>
  );
}

const userSegmentationQuery = (
  <>
    <span className='accordion-content-comment'>-- 1. GET PRODUCT TRAINING COURSES ONLY</span>
    {`
    with relevant_content AS(
        select
            content_id
        from
            academy.dim_LearningContent
        where
            category = 'Product Training'
    ),
     `}

    <span className='accordion-content-comment'>-- 2. COUNT HOW MANY COURSES ARE IN RELEVANT_CONTENT - DENOMINATOR FOR #4</span>
    {`
     content_count as(
        select
            count(distinct content_id) as total_count
        from
            relevant_content
      ),
      `}

    <span className='accordion-content-comment'>-- 3. PULL USER ENGAGEMENT ON RELEVANT CONTENT</span>
    {`
    user_completions as(
        select
            u.user_id,
            count(distinct case
                when fte.completed_date is not null and rc.content_id is not null `}<span className='accordion-content-comment'>-- MAKES SURE ONLY RELEVANT CONTENT IS INCLUDED</span>{`
                then fte.content_id
                end) as completed_count
        from
            core.dim_users u
        left join academy.fact_training_engagement fte on u.user_id = fte.user_id
        left join
            relevant_content rc on fte.content_id = rc.content_id
        group by
            u.user_id
      ),
      `}

    <span className='accordion-content-comment'>-- 4. GET % COMPLETIONS PER USER</span>
    {`
    pct_user_completions as (
        select
            uc.user_id,
            uc.completed_count,`}<span className='accordion-content-comment'>-- HOW MANY RELEVANT COURSES THEY COMPLETED</span>{`
            cc.total_content`}<span className='accordion-content-comment'>-- FROM #2</span>{`
            uc.completed_count / nullif(cc.total_content, 0)*100 as completion_pct
        from
            user_completions uc
        cross join
            content_count cc
    ),
    `}

    <span className='accordion-content-comment'>-- 5. SEGMENT THEM INTO BUCKETS BASED ON % OF COMPLETIONS</span>{`
    bucket as(
        select
            user_id,
            completion_pct,
            case
                when completion_pct = 0 then 'Not started'
                when completion_pct > 0 and completion_pct < 25 then 'Early progress (<25%)'
                when completion_pct >= 25 and completion_pct < 50 then 'Low progress (25-49%)'
                when completion_pct >= 50 and completion_pct < 75 then 'Mid progress (50-74%)'
                when completion_pct >= 75 and completion_pct < 100 then 'High progress (75-99%)'
                when completion_pct = 100 then 'Completed'
            end as completion_bucket,
            case
                when completion_pct = 0 then 1
                when completion_pct > 0 and completion_pct < 25 then 2
                when completion_pct >= 25 and completion_pct < 50 then 3
                when completion_pct >= 50 and completion_pct <75 then 4
                when completion_pct >= 75 and completion_pct < 100 then 5
                when completion_pct = 100 then 6
            end as sort_order
        from
            pct_user_completions
    )
    `}

    <span className='accordion-content-comment'>-- 6. SELECT THE OUTPUT COLUMNS</span>{`
    select
        completion_bucket as bucket,
        count(user_id) as user_count,
        round(count(user_id)*100 / sum(count(user_id)) over (), 2) as pct_of_users`}<span className='accordion-content-comment'>-- PCT OF USERS WITHIN EACH BUCKET</span>{`
    from
        bucket
    group by
        completion_bucket, sort_order
    order by sort_order
    `}
  </>
)

const performanceComparisonQuery = (
  <>
    <span className='accordion-content-comment'>-- 1. GET PRODUCT TRAINING COURSES ONLY</span>
    {`
    with relevant_content AS(
        select
            content_id
        from
            academy.dim_LearningContent
        where
            category = 'Product Training'
            ),
    `}

    <span className='accordion-content-comment'>-- 2. COUNT HOW MANY COURSES ARE IN RELEVANT_CONTENT</span>
    {`
    content_count as (
        select count (distinct content_id) as total_content
        FROM
            relevant_content
    ),
    `}

    <span className='accordion-content-comment'>-- 3. COUNT % COMPLETION AS OF EACH INTERACTION DATE</span>
    {`
    interaction_completion_pct as (
        SELECT
            fi.interaction_id,
            fi.user_id,
            fi.interaction_start,
            count(distinct CASE
                when fte.completed_date is not NULL
                and cast(fte.completed_date as date) <= cast(interaction_start as date)
                and rc.content_id is not null
                then fte.content_id
                end) / nullif(cc.total_content, 0) * 100 as completion_pct
        from
            product.fact_session_feature_interactions fi
        inner JOIN
            core.dim_users du on du.user_id = fi.user_id
        left join
            academy.fact_training_engagement fte on fte.user_id = fi.user_id
        left join
            relevant_content rc on rc.content_id = fte.content_id
        cross join
            content_count cc
        where du.is_active = 1
        group by fi.interaction_id, fi.user_id, cc.total_content, fi.interaction_start
    ),
    `}

    <span className='accordion-content-comment'>-- 4. ADD THE COMPLETION BUCKETS</span>
    {`
    bucket as(
        select
            interaction_id,
            user_id,
            case
                when completion_pct = 0 then 'Not started'
                when completion_pct > 0 and completion_pct < 25 then 'Early progress (<25%)'
                when completion_pct >= 25 and completion_pct < 50 then 'Low progress (25-49%)'
                when completion_pct >= 50 and completion_pct < 75 then 'Mid progress (50-74%)'
                when completion_pct >= 75 and completion_pct < 100 then 'High progress (75-99%)'
                when completion_pct = 100 then 'Completed'
            end as completion_bucket,
            case
                when completion_pct = 0 then 1
                when completion_pct > 0 and completion_pct < 25 then 2
                when completion_pct >= 25 and completion_pct < 50 then 3
                when completion_pct >= 50 and completion_pct < 75 then 4
                when completion_pct >= 75 and completion_pct < 100 then 5
                when completion_pct = 100 then 6
            end as sort_order
        from interaction_completion_pct
    )

    select
        completion_bucket as bucket,
        round(count(distinct interaction_id) / nullif(count(distinct user_id), 0), 2) as avg_interactions_per_user
    from
        bucket
    group by sort_order, bucket
    order by sort_order
    `}
  </>
)

const generalTrainedFlagQuery = (
  <>
    {`create or replace view academy.vw_usertrainingstatus as(

    `}
    <span className='accordion-content-comment'>-- 1. GET PRODUCT TRAINING COURSES ONLY</span>
    {`
    WITH relevant_content AS (
      SELECT content_id, content_name, created_date
      FROM academy.dim_LearningContent
      WHERE category = 'Product Training'
    ),
    `}

    <span className='accordion-content-comment'>-- 2. USER COMPLETION COUNT ON PRODUCT TRAINING</span>
    {`
    user_progress AS (
      SELECT
        du.user_id,
        du.email,
        COUNT(DISTINCT CASE
            WHEN te.completed_date IS NOT NULL
            AND rc.content_id IS NOT NULL
            THEN te.content_id
        END) AS completed_courses
      FROM core.dim_users du
      LEFT JOIN academy.fact_training_engagement te ON du.user_id = te.user_id
      LEFT JOIN relevant_content rc ON te.content_id = rc.content_id
      WHERE du.is_active = 1
      GROUP BY 1, 2
    ),
    `}

    <span className='accordion-content-comment'>-- 3. GET FIRST DATE OF EACH COURSE COMPLETION</span>
    {`
    first_completions AS (
      SELECT
        te.user_id,
        te.content_id,
        MIN(te.completed_date) AS completed_date
      FROM academy.fact_training_engagement te
      INNER JOIN relevant_content rc ON te.content_id = rc.content_id
      WHERE te.completed_date IS NOT NULL
      GROUP BY 1, 2
    ),
    `}

    <span className='accordion-content-comment'>-- 4. GET COMPLETION COUNT AND PRODUCT TRAINING CATALOG SIZE ON EACH COMPLETION DATE</span>
    {`
    ranked_completions AS (
      SELECT
        user_id,
        completed_date,
        ROW_NUMBER() OVER (
          PARTITION BY user_id
          ORDER BY completed_date
        ) AS cumulative_distinct_courses,
        (
          SELECT COUNT(DISTINCT content_id)
          FROM relevant_content rc2
          WHERE rc2.created_date <= completed_date `}<span className='accordion-content-comment'>-- MAKES SURE THE COUNT INCLUDES AVAILABLE COURSES BY COMPLETION DATES</span>{`
        ) AS courses_available_at_date
      FROM first_completions
    ),
    `}

    <span className='accordion-content-comment'>-- 5. GET THE DATE WHEN USERS PASSED 50% THRESHOLD</span>
    {`
    trained_date AS (
      SELECT
        user_id,
        MIN(completed_date) AS trained_on_date
      FROM ranked_completions
      WHERE cumulative_distinct_courses >= CEIL(courses_available_at_date * 0.5)
      GROUP BY 1
    )
    `}

    <span className='accordion-content-comment'>-- 6. SELECT FINAL OUTPUT, MARKING USERS AS TRAINED WHEN TRAINING DATE IS NOT EMPTY</span>
    {`
    SELECT
      up.user_id,
      up.email,
      up.completed_courses,
      total.cnt AS current_total_courses,
      SAFE_DIVIDE(up.completed_courses, total.cnt) * 100 AS overall_completion_pct,
      CASE WHEN td.trained_on_date IS NOT NULL THEN TRUE ELSE FALSE END AS is_trained_overall,
      td.trained_on_date AS completion_date
    FROM user_progress up
    CROSS JOIN (SELECT COUNT(DISTINCT content_id) AS cnt FROM relevant_content) AS total
    LEFT JOIN trained_date td ON up.user_id = td.user_id
    )
    `}
  </>
)

const validationQuery = (
  <>
    <span className='accordion-content-comment'>-- 1. GET PRODUCT TRAINING COURSES ONLY</span>
    {`
    with relevant_content AS(
        select
            content_id,
            content_name,
            created_date
        from
            academy.dim_LearningContent
        where
            category = 'Product Training'
            ),
    `}

    <span className='accordion-content-comment'>-- 2. GET FIRST COMPLETION DATES FOR A USER</span>
    {`
    first_completions as(
      select
        fte.content_id,
        min(fte.completed_date) as completed_date
      from
        academy.fact_training_engagement fte
      join
        relevant_content rc on rc.content_id = fte.content_id
      where
        fte.user_id = 8249 `}<span className='accordion-content-comment'>-- FILTER A USER TO VALIDATE</span>{`
      and fte.completed_date is not null
      group by fte.content_id
    ),
    `}

    <span className='accordion-content-comment'>-- 3. GET CATALOG SIZE ON EACH COMPLETION DATE</span>
    {`
    catalog_size as(
      select
        fc.completed_date,
        fc.content_id,
        (select
          count(distinct rc.content_id)
        from
          relevant_content rc
        where
          rc.created_date <= fc.completed_date) as course_count
      from
        first_completions fc
    )
    `}

    <span className='accordion-content-comment'>-- 4. SELECT FINAL OUTPUT, COMPLETION TIMELINES OF FILTERED USER AND CONFIRM THE EXACT POINT AT WHICH A USER IS MARKED AS TRAINED</span>
    {`
    select
      cs.completed_date,
      rc.content_name,
      row_number() over (order by cs.completed_date) as completion_count, `}<span className='accordion-content-comment'>-- COMPLETION COUNT ON EACH COMPLETION DATE</span>{`
      cs.course_count as catalog_size_at_date,
      cs.course_count * 0.5 as threshold_at_date,
      row_number() over (order by cs.completed_date) >= (cs.course_count * 0.5) as is_trained_at_date `}<span className='accordion-content-comment'>-- CHECK WHETHER THE USER IS TRAINED OR NOT ON EACH COMPLETION DATE</span>{`
    from
      catalog_size cs
    join
      relevant_content rc on rc.content_id = cs.content_id
    order by cs.completed_date
    `}
  </>
)

const timeAwareTrainedEventDax = (
  <>
    {`is_general_trained =

    `}
    <span className='accordion-content-comment'>-- 1. GET TRAINED DATE FROM THE VIEW FOR EACH USER PER EVENT</span>
    {`
    VAR UserTrainingDate =
        CALCULATE(
            MIN(vw_usertrainingstatus[is_trained_on]),
            FILTER(
                vw_usertrainingstatus,
                vw_usertrainingstatus[user_id] = fact_session_feature_interactions[user_id]
                && vw_usertrainingstatus[is_trained] = TRUE()
            )
        )
    `}

    <span className='accordion-content-comment'>-- 2. IF TRAINED DATE HAPPENED ON OR BEFORE THE FEATURE INTERACTION TIME, THE USER IS TRAINED (1) ELSE UNTRAINED (0)</span>
    {`
    RETURN
        IF(
            NOT(ISBLANK(UserTrainingDate)) &&
            UserTrainingDate <= fact_session_feature_interactions[interaction_start],
            1,
            0
        )
    `}
  </>
)

const flexibleTrainedUserDax = (
  <>
    {`_fa_avg_per_trained =

    `}
    <span className='accordion-content-comment'>// 1. ALL CONTENT AND FEATURE ARE SELECTED BY DEFAULT, OTHERWISE CHECK WHAT VALUES ARE APPLIED</span>
    {`
    VAR SelectedContent = SELECTEDVALUE(_slicer_content_name[content_name], "All")
    VAR SelectedFeature = SELECTEDVALUE(_slicer_feature_name[feature_name], "All")
    `}

    <span className='accordion-content-comment'>// 2. GET FILTERED DATES</span>
    {`
    VAR StartDate = [_context_start_date]
    VAR EndDate = [_context_end_date]

    RETURN
    IF(
        SelectedContent = "All",
        IF(
            SelectedFeature = "All",
    `}

    <span className='accordion-content-comment'>// 3. LOGIC IF NOTHING IS SELECTED, COUNT UNIQUE INTERACTION ID DIVIDED BY COUNT OF UNIQUE TRAINED USER WITH INTERACTIONS WITHIN SELECTED DATE RANGE</span>
    {`
        DIVIDE(
            CALCULATE(
                DISTINCTCOUNT(fact_session_feature_interactions[interaction_id]),
                fact_session_feature_interactions[interaction_start] >= StartDate,
                fact_session_feature_interactions[interaction_start] <= EndDate,
                fact_session_feature_interactions[is_general_trained] = 1 `}<span className='accordion-content-comment'>// FLAG FOR TRAINED IS 1. THIS MEASURE IS THE SAME FOR AVERAGE PER UNTRAINED USER, JUST CHANGE THE VALUE TO 0</span>{`
            ),
            CALCULATE(
                DISTINCTCOUNT(fact_session_feature_interactions[user_id]),
                fact_session_feature_interactions[interaction_start] >= StartDate,
                fact_session_feature_interactions[interaction_start] <= EndDate,
                fact_session_feature_interactions[is_general_trained] = 1
            ),
            0
        ),
    `}

    <span className='accordion-content-comment'>// 4. LOGIC IF CONTENT IS NOT FILTERED BUT FEATURE IS, COUNT UNIQUE INTERACTION OF FILTERED FEATURE DIVIDED BY COUNT OF UNIQUE TRAINED USERS INTERACTING WITH THE FILTERED FEATURE</span>
    {`
        DIVIDE(
            CALCULATE(
                DISTINCTCOUNT(fact_session_feature_interactions[interaction_id]),
                fact_session_feature_interactions[interaction_start] >= StartDate,
                fact_session_feature_interactions[interaction_start] <= EndDate,
                fact_session_feature_interactions[is_general_trained] = 1,
                TREATAS(
                    FILTER(VALUES(_slicer_feature_name[feature_name]), _slicer_feature_name[feature_name] <> "All"),
                    fact_session_feature_interactions[feature_accessed]
                )
            ),
            CALCULATE(
                DISTINCTCOUNT(fact_session_feature_interactions[user_id]),
                fact_session_feature_interactions[interaction_start] >= StartDate,
                fact_session_feature_interactions[interaction_start] <= EndDate,
                fact_session_feature_interactions[is_general_trained] = 1,
                TREATAS(
                    FILTER(VALUES(_slicer_feature_name[feature_name]), _slicer_feature_name[feature_name] <> "All"),
                    fact_session_feature_interactions[feature_accessed]
                )
            ),
            0
        )
    ),
    `}

    <span className='accordion-content-comment'>// 5. WRITE BASE INTERACTION LOGIC FOR IF CONTENT IS FILTERED</span>
    {`
    VAR BaseInteraction =
        SUMMARIZE(
            FILTER(
                fact_session_feature_interactions,
                fact_session_feature_interactions[interaction_start] >= StartDate &&
                fact_session_feature_interactions[interaction_start] <= EndDate &&
                (SelectedFeature = "All" || fact_session_feature_interactions[feature_accessed] = SelectedFeature)
            ),
            fact_session_feature_interactions[interaction_id],
            fact_session_feature_interactions[user_id],
            fact_session_feature_interactions[interaction_start]
        )
    `}

    <span className='accordion-content-comment'>// 6. IF CONTENT IS FILTERED, CREATE KEY COLUMNS AND MARK USERS AS TRAINED WHEN FILTERED CONTENT IS COMPLETED BEFORE OR ON INTERACTION TIME</span>
    {`
    VAR ClassifiedRows =
        ADDCOLUMNS(
            BaseInteraction, `}<span className='accordion-content-comment'>-- LOGIC FROM #5</span>{`
            "@trained", `}<span className='accordion-content-comment'>-- VIRTUAL COLUMN FOR TRAINED FLAGS</span>{`
                VAR uid = [user_id]
                VAR idate = [interaction_start]
                VAR tdate =
                    CALCULATE(
                        MIN(fact_training_completions[completed_date]),
                        fact_training_completions[user_id] = uid,
                        fact_training_completions[content_name] = SelectedContent
                    )
                RETURN IF(NOT(ISBLANK(tdate)) && tdate <= idate, 1, 0) `}<span className='accordion-content-comment'>// IF FILTERED CONTENT IS COMPLETED BEFORE OR ON INTERACTION TIME, TRAINED (1), ELSE UNTRAINED (0)</span>{`
        )
    `}

    <span className='accordion-content-comment'>// 7. FLAG TRAINED INTRACTIONS. CHANGE VALUE TO 0 FOR THE UNTRAINED MEASURE</span>
    {`
    VAR TrainedInteractions = FILTER(ClassifiedRows, [@trained] = 1)
    `}

    <span className='accordion-content-comment'>// 8. DIVIDE UNIQUE TRAINED INTERACTIONS BY UNIQUE TRAINED USERS</span>
    {`
    RETURN
    DIVIDE(COUNTROWS(TrainedInteractions ), COUNTROWS(DISTINCT(SELECTCOLUMNS(TrainedInteractions , "uid", [user_id]))), 0)
)
    `}
  </>
)

const sameTenureComparisonDax = (
  <>
    <span className='accordion-content-comment'>// # CALCULATED COLUMN FOR ACCOUNT AGE AS OF INTERACTION DATE</span>
    {`
    days_since_signup =
    VAR user_signup = RELATED(dim_user[signup_date])

    RETURN
    fact_session_feature_interactions[interaction_start] - user_signup
    `}

    <span className='accordion-content-comment'>// # SAME-TENURE AVERAGE MEASURE</span>
    {`
    _fa_same_tenure_trained =
    `}

    <span className='accordion-content-comment'>// 1. ALL CONTENT AND FEATURE ARE SELECTED BY DEFAULT, OTHERWISE CHECK WHAT VALUES ARE APPLIED</span>
    {`
    VAR SelectedContent = SELECTEDVALUE(_slicer_content_name[content_name], "All")
    VAR SelectedFeature = SELECTEDVALUE(_slicer_feature_name[feature_name], "All")

    RETURN
    IF(
        SelectedContent = "All",
        IF(
            SelectedFeature = "All",
    `}

    <span className='accordion-content-comment'>// 2. LOGIC IF NOTHING IS FILTERED, DIVIDE UNIQUE INTERACTION BY UNIQUE TRAINED USER</span>
    {`
        CALCULATE(
            DIVIDE(
                DISTINCTCOUNT(fact_session_feature_interactions[interaction_id]),
                DISTINCTCOUNT(fact_session_feature_interactions[user_id]),
                0
            ),
            fact_session_feature_interactions[days_since_signup] > 0,
            fact_session_feature_interactions[days_since_signup] <= 180, `}<span className='accordion-content-comment'>// ONLY FOR INTERACTIONS WITHIN USERS' FIRST 6 MONTHS</span>{`
            fact_session_feature_interactions[is_general_trained] = 1,
            TREATAS(VALUES(signup_cohort_slicer[SignupYear]), dim_user[signup_year]),
            TREATAS(VALUES(signup_cohort_slicer[SignUpMonth]), dim_user[signup_month])
        ),
    `}

    <span className='accordion-content-comment'>// 3. LOGIC IF CONTENT IS NOT FILTERED BUT FEATURE IS</span>
    {`
        CALCULATE(
            DIVIDE(
                DISTINCTCOUNT(fact_session_feature_interactions[interaction_id]),
                DISTINCTCOUNT(fact_session_feature_interactions[user_id]),
                0
            ),
            fact_session_feature_interactions[days_since_signup] > 0,
            fact_session_feature_interactions[days_since_signup] <= 180,
            fact_session_feature_interactions[is_general_trained] = 1,
            TREATAS(VALUES(signup_cohort_slicer[SignupYear]), dim_user[signup_year]),
            TREATAS(VALUES(signup_cohort_slicer[SignUpMonth]), dim_user[signup_month]),
            TREATAS(
                FILTER(VALUES(_slicer_feature_name[feature_name]), _slicer_feature_name[feature_name] <> "All"),
                fact_session_feature_interactions[feature_accessed]
            )
        )
    ),
    `}

    <span className='accordion-content-comment'>// 5. LOGIC IF CONTENT IS FILTERED</span>
    {`
        CALCULATE(
    `}

    <span className='accordion-content-comment'>// BASE INTERACTION COLUMNS</span>
    {`
            VAR Interactions =
                SELECTCOLUMNS(
                    SUMMARIZE(
                        FILTER(
                            fact_session_feature_interactions,
                            fact_session_feature_interactions[days_since_signup] > 0 &&
                            fact_session_feature_interactions[days_since_signup] <= 180 &&
                            (SelectedFeature = "All" || fact_session_feature_interactions[feature_accessed] = SelectedFeature)
                        ),
                        fact_session_feature_interactions[interaction_id],
                        fact_session_feature_interactions[interaction_start],
                        fact_session_feature_interactions[user_id]
                    ),
                    "@iid", [interaction_id],
                    "@istart", [interaction_start],
                    "@iuid", [user_id]
                )
    `}

    <span className='accordion-content-comment'>// VIRTUAL COLUMN TO FLAG TRAINED USERS</span>
    {`
            VAR ClassifiedRows =
                ADDCOLUMNS(
                    Interactions,
                    "@is_trained",
                        VAR uid = [@iuid]
                        VAR idate = [@istart]
                        VAR tdate =
                            CALCULATE(
                                MIN(fact_training_completions[completed_date]),
                                fact_training_completions[user_id] = uid,
                                fact_training_completions[content_name] = SelectedContent
                            )
                        RETURN IF(NOT(ISBLANK(tdate)) && tdate <= idate, 1, 0) `}<span className='accordion-content-comment'>// IF TRAINING COMPLETION HAPPENS BEFORE INTERACTION TIME, USER IS TRAINED (1), ELSE UNTRAINED (0)</span>{`
                )

            VAR TrainedRows = FILTER(ClassifiedRows, [@is_trained] = 1)
            VAR TrainedEvents = COUNTROWS(TrainedRows)
            VAR TrainedUsers = COUNTROWS(DISTINCT(SELECTCOLUMNS(TrainedRows, "uid", [@iuid])))
    `}

    <span className='accordion-content-comment'>// FINAL OUTPUT FOR LOGIC #5</span>
    {`
            RETURN DIVIDE(TrainedEvents, TrainedUsers, 0),
            TREATAS(VALUES(signup_cohort_slicer[SignupYear]), dim_user[signup_year]),
            TREATAS(VALUES(signup_cohort_slicer[SignUpMonth]), dim_user[signup_month])
        )
    )
    `}
  </>
)

const didHelpDax = (
  <>
    <span className='accordion-content-comment'>// # PRE- AND POST- TRAINING COMPARISON SELECTOR BETWEEN 1 TO 6 MONTHS, DEFAULT TO 3 MONTHS</span>
    {`
    _did_months = SELECTEDVALUE(DiD_comparison_months[Value], 3)
    `}

    <span className='accordion-content-comment'>// # TRAINING WINDOW BASED ON WHICH VISUAL THE MEASURE IS PLACED</span>
    {`
    _did_training_start =
    SWITCH(
        SELECTEDVALUE(_selected_visual[Value]),
        "Table", MIN(table_Calendar[Date]),
        "KPI", MIN(kpi_Calendar[Date]),
        MIN(DiD_training_Calendar[Date])
    )

    _did_training_end =
    SWITCH(
        SELECTEDVALUE(_selected_visual[Value]),
        "Table", MAX(table_Calendar[Date]),
        "KPI", MAX(kpi_Calendar[Date]),
        MAX(DiD_training_Calendar[Date])
    )
    `}

    <span className='accordion-content-comment'>// # "BEFORE" PERIOD WINDOW</span>
    {`
    _did_before_end = [_did_training_start] - 1 `}<span className='accordion-content-comment'>-- // 1 DAY BEFORE TRAINING STARTS</span>{`

    _did_before_start = EDATE([_did_before_end], - [_did_months]) + 1 `}<span className='accordion-content-comment'>-- // FIRST DAY OF THE SELECTED MONTH WINDOW ENDING ON _did_before_end</span>{`
    `}

    <span className='accordion-content-comment'>// # "AFTER" PERIOD WINDOW</span>
    {`
    _did_after_start = [_did_training_end] + 1

    _did_after_end = EDATE([_did_after_start], [_did_months]) - 1
    `}

    <span className='accordion-content-comment'>// # FLAG TRAINED USERS BASED ON 50% THRESHOLD (DID REQUIRES CLASSIFYING EACH USER AS TRAINED WITHIN THE WINDOW, SO THE APPROACH IS DIFFERENT THAN THE OTHER TWO METHODS)</span>
    {`
    _is_user_did_general_trained =
    `}

    <span className='accordion-content-comment'>// 1. GET CURRENT USERS IN CONTEXT AND SELECTED TRAINING WINDOW</span>
    {`
    VAR CurrentUser = MAX(dim_user[user_id])
    VAR TrainingStart = [_did_training_start]
    VAR TrainingEnd = [_did_training_end]
    `}

    <span className='accordion-content-comment'>// 2. GET TRAINING COMPLETION DATE</span>
    {`
    VAR UserTrainingDate =
        CALCULATE(
            (vw_usertrainingstatus[completion_date]),
            FILTER(
                vw_usertrainingstatus,
                vw_usertrainingstatus[user_id] = CurrentUser &&
                vw_usertrainingstatus[is_trained_overall] = TRUE()
            )
        )
    `}

    <span className='accordion-content-comment'>// 3. IF USER TRAINED WITHIN SELECTED WINDOW, USER IS TRAINED (1), ELSE UNTRAINED (0)</span>
    {`
    RETURN
        IF(
           UserTrainingDate >= TrainingStart && UserTrainingDate <= TrainingEnd, 1, 0
        )
    `}

    <span className='accordion-content-comment'>// # FLAG TRAINED USERS BASED ON FILTERED CONTENT</span>
    {`
    _is_user_did_course_trained =
    `}

    <span className='accordion-content-comment'>// 1. GET CURRENT USERS IN CONTEXT AND SELECTED TRAINING WINDOW</span>
    {`
    VAR CurrentUser = MAX(dim_user[user_id])
    VAR TrainingStart = [_did_training_start]
    VAR TrainingEnd = [_did_training_end]
    `}

    <span className='accordion-content-comment'>// 2. GET EARLIEST COURSE COMPLETION DATE FOR FILTERED CONTENT</span>
    {`
    VAR SelectedContent = SELECTEDVALUE(_slicer_content_name[content_name])
    VAR UserTrainingDate =
        CALCULATE(
            MIN(fact_training_completions[completed_date]),
            FILTER(
                fact_training_completions,
                fact_training_completions[user_id] = CurrentUser &&
                fact_training_completions[content_name] IN SelectedContent
            )
        )
    `}

    <span className='accordion-content-comment'>// 3. IF USER TRAINED WITHIN SELECTED WINDOW, USER IS TRAINED (1), ELSE UNTRAINED (0)</span>
    {`
    RETURN
        IF(
            UserTrainingDate >= TrainingStart && UserTrainingDate <= TrainingEnd, 1, 0
        )
    `}

    <span className='accordion-content-comment'>// # FLEXIBLE TRAINED FLAG BASED ON CONTENT FILTER</span>
    {`
    _is_user_did_metric_flexible_trained =
    VAR SelectedContent = SELECTEDVALUE(_slicer_content_name[content_name], "All")
    `}

    <span className='accordion-content-comment'>// 1. IF SELECTEDCONTENT IS ALL, USE 50% THRESHOLD LOGIC, ELSE SELECTED CONTENT LOGIC</span>
    {`
    RETURN
    IF(SelectedContent = "All",
        [_is_user_did_general_trained],
        [_is_user_did_course_trained]
    )
    `}
  </>
)

const didIntermediateDax = (
  <>
    {`_fa_did_trained_before =

    `}
    <span className='accordion-content-comment'>// 1. GET DATE WINDOW</span>
    {`
    VAR BeforeStart = [_did_before_start]
    VAR BeforeEnd = [_did_before_end]
    VAR AfterStart = [_did_after_start]
    VAR AfterEnd = [_did_after_end]
    `}

    <span className='accordion-content-comment'>// 2. CHECK WHAT FEATURE IS SELECTED, DEFAULT TO ALL</span>
    {`
    VAR SelectedFeature = SELECTEDVALUE(_slicer_feature_name[feature_name], "All")
    `}

    <span className='accordion-content-comment'>// 3. LOGIC IF NO FEATURE IS FILTERED, AVERAGE OF DISTINCT FEATURES INTERACTIONS</span>
    {`
    VAR AllFeature =
        AVERAGEX(
            FILTER(
                VALUES(dim_user[user_id]),
                [_is_user_did_metric_flexible_trained] = 1 `}<span className='accordion-content-comment'>// FROM HELPER MEASURE. FOR UNTRAINED MEASURE, CHANGE VALUE TO 0</span>{`
                    && CALCULATE(
    `}

    <span className='accordion-content-comment'>// ONLY FOR USERS WHO HAVE INTERACTIONS IN BOTH BEFORE AND AFTER WINDOWS</span>
    {`
                        COUNTROWS(fact_session_feature_interactions),
                        fact_session_feature_interactions[interaction_start] >= BeforeStart,
                        fact_session_feature_interactions[interaction_start] <= BeforeEnd
                    ) > 0
                    && CALCULATE(
                        COUNTROWS(fact_session_feature_interactions),
                        fact_session_feature_interactions[interaction_start] >= AfterStart,
                        fact_session_feature_interactions[interaction_start] <= AfterEnd
                    ) > 0
            ),
            CALCULATE(
                COUNTROWS(fact_session_feature_interactions),
                fact_session_feature_interactions[interaction_start] >= BeforeStart,
                fact_session_feature_interactions[interaction_start] <= BeforeEnd `}<span className='accordion-content-comment'>// FOR "AFTER" MEASURE, CHANGE TO AFTERSTART AND AFTEREND</span>{`
            )
        )
    `}

    <span className='accordion-content-comment'>// 4. LOGIC IF FEATURE IS FILTERED</span>
    {`
    VAR FilteredFeature =
        CALCULATE(
            AVERAGEX(
                FILTER(
                    VALUES(dim_user[user_id]),
                    [_is_user_did_metric_flexible_trained] = 1
                        && CALCULATE(
                            COUNTROWS(fact_session_feature_interactions),
                            fact_session_feature_interactions[interaction_start] >= BeforeStart,
                            fact_session_feature_interactions[interaction_start] <= BeforeEnd
                        ) > 0
                        && CALCULATE(
                            COUNTROWS(fact_session_feature_interactions),
                            fact_session_feature_interactions[interaction_start] >= AfterStart,
                            fact_session_feature_interactions[interaction_start] <= AfterEnd
                        ) > 0
                ),
                CALCULATE(
                    COUNTROWS(fact_session_feature_interactions),
                    fact_session_feature_interactions[interaction_start] >= BeforeStart,
                    fact_session_feature_interactions[interaction_start] <= BeforeEnd
                )
            ),
            TREATAS(
                FILTER(VALUES(_slicer_feature_name[feature_name]), _slicer_feature_name[feature_name] <> "All"),
                fact_session_feature_interactions[feature_accessed]
            )
        )

    RETURN IF(SelectedFeature = "All", AllFeature, FilteredFeature)
    `}
  </>
)

const didFinalDax = (
  <>
    {`_fa_did_trained_change = [_fa_did_trained_after] - [_fa_did_trained_before]`}
  </>
)

const metricBasedFinalDax = (
  <>
    {`avg_per_trained =
    VAR CurrentMetric = SELECTEDVALUE(dim_metric_type[metric_type])

    RETURN
    SWITCH(
        CurrentMetric,
        "Feature Adoption", [_fa_avg_per_trained],
        "Bot Initiation", [_bi_avg_per_trained],
        "Time on Task", [_tot_avg_per_trained],
        BLANK()
    )

    pct_avg =
    VAR CurrentMetric = SELECTEDVALUE(dim_metric_type[metric_type])
    VAR Difference = [avg_per_trained] - [avg_per_untrained]

    VAR PreResult = Difference / ABS([avg_per_untrained]) * 100
    VAR Result =
       IF(ABS(PreResult) >= 1000,
            FORMAT(ABS(PreResult) / 1000, "0.0") & "K%",
            FORMAT(ABS(PreResult), "0") & "%"
        )
    `}
    <span className='accordion-content-comment'>// INDICATOR LOGIC DEPENDS ON THE NATURE OF THE METRIC. WHEN HIGHER IS BETTER, POSITIVE DIFFERENCE IS GREEN, WHEN LOWER IS BETTER, POSITIVE DIFFERENCE IS RED</span>
    {`
    VAR GoalIncreaseSign =
     IF(
        Difference > 0,
        "🟢▲",
        "🔴▼"
     )

     VAR GoalDecreaseSign =
      IF(
        Difference > 0,
        "🔴▲",
        "🟢▼"
     )

    RETURN
    SWITCH(
        CurrentMetric,
        "Feature Adoption",
        GoalIncreaseSign & " " & Result,
        "Time on Task",
        GoalDecreaseSign & " " & Result,
        "Bot Initiation",
        GoalDecreaseSign & " " & Result
    )
    `}
  </>
)

function GifPlayImage({ poster, gif, alt }) {
  const [playing, setPlaying] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const src = playing ? gif : poster;
  return (
    <div className="gif-figure">
      <button type="button" className="gif-toggle" onClick={() => setPlaying(p => !p)}>
        <img className="gif-toggle__icon" src={playing ? '/images/owllocate/Pause.png' : '/images/owllocate/Play.png'} alt="" />
        {playing ? 'Pause gif' : 'Play gif'}
      </button>
      <div className="zoomable-img" onClick={() => setZoomed(true)}>
        <img src={src} alt={alt} />
        <span className="zoom-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="14.5" y2="14.5" />
            <line x1="7" y1="5" x2="7" y2="9" />
            <line x1="5" y1="7" x2="9" y2="7" />
          </svg>
        </span>
      </div>
      {zoomed && (
        <div className="zoom-overlay" onClick={() => setZoomed(false)}>
          <img src={src} alt={alt} />
        </div>
      )}
    </div>
  );
}

function CodeRef({ icon = '</>', children }) {
  return (
    <span className="code-ref">
      <span className="code-ref__glyph">{icon}</span> {children}
    </span>
  );
}

function ImgCaption({ children }) {
  return <p className="img-caption">{children}</p>;
}

/* Reusable image carousel: gold subtitle + caption + image (or placeholder),
   with arrows and dots. Pass slides as [{ title, caption, img, alt }]. */
function Carousel({ slides, placeholderLabel = 'Image coming soon' }) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;
  const s = slides[current];
  const go = (i) => setCurrent((i + total) % total);

  return (
    <div className="carousel">
      <div className="carousel-head">
        {s.title && <h3>{s.title}</h3>}
        {s.caption && <p>{s.caption}</p>}
      </div>

      <div className="carousel-box">
        <button className="carousel-arrow carousel-arrow--prev" onClick={() => go(current - 1)} aria-label="Previous">‹</button>
        {s.img
          ? <ZoomableImage src={s.img} alt={s.alt || s.title || 'slide'} />
          : <div className="ti-carousel__placeholder">{placeholderLabel}</div>}
        <button className="carousel-arrow carousel-arrow--next" onClick={() => go(current + 1)} aria-label="Next">›</button>
      </div>

      <div className='carousel-dots'>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? ' active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* What I Built — carousel, images not ready yet → placeholders.
   Subtitles verified slide-by-slide from the live page. */
const whatIBuiltSlides = [
  {
    title: 'Overview Page',
    caption: 'An overview page with dynamic summary on all three measurement methods and metrics, so readers know the current state of training performance without digging further. A bot interpreter with example is linked directly from the page for on-demand guidance.',
    img: '/images/training-impact/overview.png',
    alt: 'Overview page',
  },
  {
    title: 'Program Reach',
    caption: 'Headline KPIs for population, coverage, causal effect, and associated impact, so leadership can assess program scale and effectiveness in one glance. Below, a summary card breaking down main KPIs per business metric, which is where reader sees whether training is both associated with and causing behavior changes on all measured business goals.',
    img: '/images/training-impact/program-reach.png',
    alt: 'Program reach',
  },
  {
    title: 'Effectiveness and Account Health',
    caption: 'Associated impact and causal training effect per metric over time, switchable between WoW, MoM, and QoQ, so teams can monitor trends at the cadence that matches their decision cycle. Next to it, an account-level health status calculated from key performance indicators, so Customer Success teams can identify which accounts may need interventions.',
    img: '/images/training-impact/effectiveness-and-account-health.png',
    alt: 'Effectiveness and account health',
  },
  {
    title: 'Dedicated Metric Pages',
    caption: 'Each business metric gets a full analytical view covering same-tenure comparison, DiD effect, performance over time, and period-over-period tracking, so users can investigate whats driving the numbers they see on the overview. All built on a shared foundation for maintainability.',
    img: '/images/training-impact/dedicated-metric-pages.png',
    alt: 'Dedicated metric pages',
  },
  {
    title: 'Ask the Owl – Bot Interpreter',
    caption: "An AI interpreter built on the report's methodology that can read screenshots, explains metrics, and guides investigation without drawing conclusions. Built to improve report accessibility without loosening the analytical standards that training measurement needs.",
    img: '/images/training-impact/ask-the-owl-bot-interpreter.png',
    alt: 'Ask the Owl bot interpreter',
  },
];

/* Ask the Owl — carousel, 3 images, placeholders for now. */
const askTheOwlSlides = [
  { title: null, caption: null, img: '/images/training-impact/owl-summary.png', alt: 'Ask the Owl demo 1' },
  { title: null, caption: null, img: '/images/training-impact/owl-dig.png', alt: 'Ask the Owl demo 2' },
  { title: null, caption: null, img: '/images/training-impact/owl-signal.png', alt: 'Ask the Owl demo 3' },
];

export default function TrainingImpactPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Nav />
      <main style={{ flex: 1 }}>

        {/* PROJECT HERO */}
        <section className="project-hero">
          <h2>Measuring Training Impact</h2>
          <div className="project-hero__image">
            <img src="/images/card-training-impact.png" alt="Dashboard UI elements" />
          </div>
          <div className="project-hero__text">
            <p>"Is training driving results?" is the question every stakeholder asks and most learning teams struggle to answer confidently.</p>
            <p>
              This work piece walksthrough the measurement framework and Power BI report I built so that
              question always has an{' '}
              <strong style={{ color: 'var(--red)', textDecoration: 'underline' }}>honest, data-backed answer</strong>,
              and a clear direction forward.
            </p>
            <a
              href="https://app.powerbi.com/view?r=eyJrIjoiMjAzZDhhZGUtZTNkOS00Mjg5LTkwYTYtNDJlOTBhNGE4MzEyIiwidCI6ImVkNjUyMGQ1LTVhNjgtNDU5NS1hMTUxLTMxNGJhMjlkMDkzZSIsImMiOjl9&pageName=9b76e23a95ea177e60bd"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              View report
            </a>
          </div>
        </section>

        {/* SUMMARY */}
        <section style={{ backgroundColor: 'var(--blue-bg)' }}>
          <div className='summary-section'>
            <h2>Summary</h2>
            <div className='summary-grid'>
              <div className='summary-column'>
                <h3>The Gap</h3>
                <p>
                  Training happened, but the results were unclear. The definition of a trained user didn't
                  say much about what they were actually supposed to be trained for. The metrics tracked,
                  like completion rates and CSAT, had no reliable connection to what the business cared
                  about. As an IC, that left me wondering how my work actually contribute to customer
                  success and business outcomes.
                </p>
              </div>

              <div className='summary-column'>
                <h3>The Work</h3>
                <p>
                  A measurement framework with flexible definitions of trained users based on intended
                  business outcomes, with in-depth reporting in Power BI. To get there, I retrieved relevant
                  business data in the data warehouse and analyzed how users at different stages of training
                  actually performed on the platform. I wanted the definition of trained to be grounded in
                  where training visibly starts moving the needle.
                </p>
              </div>

              <div className='summary-column'>
                <h3>The Shift</h3>
                <p>
                  Trained user rate entered departmental OKRs, making training a business-accountable metric
                  for the first time. Every design decision now has a baseline to build on and a way to test
                  whether it actually worked. The function no longer reports on its own language, but rather
                  setting goals in the same terms that our crossfunctional stakeholders use to measure
                  success.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ABOUT THIS WORK */}
        <section style={{ background: 'var(--gray)', padding: '60px 0' }}>
          <div className="about-section">
            <h2>About This Work</h2>
            <p>
              The LinkedIn wisdom: "Start with business outcomes, build the training to address them, then
              decide what trained means."
            </p>
            <p>The reality is that there are two main challenges with this advice:</p>
            <ol className="about-list">
              <li>
                Most of us inherit training portfolios built by people who've moved on, and we're left
                with their courses, structure, and whatever vision they had.
              </li>
              <li>What is trained? There is no a single definition that addresses everything.</li>
            </ol>
            <p>
              Even then, proving training works is harder than it looks. Most business functions measure
              impact through a relatively clean, linear chain of events: Action ➔ Response ➔ Outcome, while
              a learning function doesn't have that luxury. Our work shapes behavior gradually, across a
              distributed population with different tenure and experience. The causal chain is long, noisy,
              and filled with variables that make it genuinely difficult to draw a line between "someone
              completed training" and "business metrics moved".
            </p>
            <p>
              In my view, if we could show that trained users consistently outperform untrained ones on
              different metrics, measured through multiple methods, with different user populations and
              different time windows, at some point the pattern itself becomes the proof.
            </p>
            <div className="disclaimer">
              This work sample runs on sample data generated to showcase my methodology and thought
              process. The framework, analytical approach, and measurement logic reflect how I work and do
              not represent real company data.
            </div>
          </div>
        </section>

        {/* WHAT I BUILT */}
        <section className="deep-section deep-section--red">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2>🔧 What I Built</h2>
            <Carousel slides={whatIBuiltSlides} placeholderLabel="Image coming soon" />
          </div>
        </section>


        {/* THE FRAMEWORK */}
        <section className="deep-section deep-section--navy">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2>📐 The Framework</h2>
            <div className='tab-content'>

              <h3>Making Sense of What Exists</h3>

              <div className='tab-content-grid'>
                <div className='tab-content-column'>
                  <p>
                    Not all courses in the LMS are relevant for measuring the particular goals we were setting.
                    I focused specifically on those categorized as Product Training, which are designed to drive
                    key behaviors like increasing engagement on core product features.
                  </p>
                  <p>
                    Once the relevant content is defined, I digged into the historical completion to understand
                    where the users actually stood and how the engagement is distributed. I.e., how many have not
                    started, partially completed, reached around halfway, or completed (almost) the full catalog.
                  </p>
                </div>

                <div className='tab-content-column'>
                  <div className="accordion-images" style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <ZoomableImage src="/images/training-impact/framework-catalog.png" alt="Sample catalog scope" crop />
                  </div>
                  <ImgCaption>Sample catalog scope</ImgCaption>
                </div>
              </div>
              <p>
                To enable this level of analysis, I sourced the data from the data warehouse instead of
                directly from the LMS reporting, so I had more flexibility in modeling and segmenting the
                users.
              </p>

              <Accordion label="<> User segmentation query">
                <div>
                  <p className='accordion-content-query'>
                    {userSegmentationQuery}
                  </p>
                </div>
              </Accordion>
            </div>

            <br></br><br></br>

            <div className='tab-content'>
              <h3>Performance of Existing User Segments</h3>

              <div className='tab-content-grid'>
                <div className='tab-content-column'>
                  <p>
                    Looking at engaged users, the largest group sat in the Early progress bucket with less than
                    25% catalog completion. But that alone doesn't tell us where to draw the line for trained.
                  </p>
                  <p>
                    So I went deeper and analyzed how the users in each bucket actually perform on on the
                    platform, because I wanted the threshold to be defined by where training starts translating
                    into results.
                  </p>
                </div>

                <div className='tab-content-column'>
                  <div className="accordion-images" style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <ZoomableImage src="/images/training-impact/framework-completion.png" alt="Distribution - output from user segmentation query" />
                  </div>
                  <ImgCaption>Distribution - output from user segmentation query</ImgCaption>
                </div>
              </div>

              <p>
                One of the primary goals of product training is to drive feature adoption and engagements, so
                thats the metric that I started with. I ran a query calculating how each segment engages with
                core features with one important restriction: segmented completions only count if they
                happened before the measured event. If Jackie was at 30% completion, their average feature
                interactions belongs in the Low progress bucket. If Jackie progressed with their training and
                is now at 60% completion, their average will move to the Mid progress bucket.
              </p>

              <Accordion label="<> Performance comparison query">
                <div>
                  <p className='accordion-content-query'>
                    {performanceComparisonQuery}
                  </p>
                </div>
              </Accordion>
            </div>

            <br></br><br></br>

            <div className='tab-content'>
              <h3>Setting a General Baseline</h3>

              <div className='tab-content-grid'>
                <div className='tab-content-column'>
                  <p>
                    The data generally shows gradual performance improvement with each completion segment, but
                    the most significant jump happens in the Mid progress bucket (50-74%). And that's where I set
                    the threshold; defining a trained user as someone who has completed at least 50% of the
                    Product Training catalog. This serves as a consistent baseline for measuring trained user
                    rates and setting targets.
                  </p>
                  <p>
                    While the specific threshold differs from what I use in my work, the logic I applied is the
                    same. And the trained user rate has been adopted into departmental OKRs since, shifting the
                    focus away from completion-based metrics toward measures that can be tied more closely to
                    business results.
                  </p>
                </div>

                <div className='content-tab-column'>
                  <div className="accordion-images" style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <ZoomableImage src="/images/training-impact/framework-performance.png" alt="Output from performance comparison query" />
                  </div>
                  <ImgCaption>Output from performance comparison query</ImgCaption>
                </div>
              </div>
            </div>

            <br></br><br></br>

            <div className='tab-content'>
              <h3>Bringing It to Power BI</h3>
              <p>
                The first step was creating a view in the data warehouse, that is sourced from tables that
                hold the LMS data with live update. This view does two things:
              </p>
              <ol className="about-list">
                <li>Flags whether a user is trained.</li>
                <li>
                  Records the date they first crossed the 50% threshold, effectively when they became
                  trained.
                </li>
              </ol>
              <p>
                Thanks to Claude, I could implement logic that evaluates training status relative to the
                total number of available courses at each point in time. This ensures that once a user is
                classified as trained, they remain so, even as the catalog expands.
              </p>
              <p>
                I have included the supporting validation below to show how the output is derived and
                verified against the underlying data.
              </p>

              <Accordion label="<> General trained flag query (AI-generated)">
                <div>
                  <p className='accordion-content-query'>
                    {generalTrainedFlagQuery}
                  </p>
                </div>
              </Accordion>

              <Accordion label="<> Validation query">
                <div>
                  <p className='accordion-content-query'>
                    {validationQuery}
                  </p>
                </div>
              </Accordion>

              <Accordion label="📷 How I validated">
                <p className='accordion__body accordion-content-text'>
                  I wrapped the final SELECT from the AI-generated query to return five sample users. The output shows training status, courses completed, catalog size, and the threshold at each completion point, flagging users as trained once they cross it.
                </p>
                <div className='accordion-images'>
                  <ZoomableImage src="/images/training-impact/framework-validation-1.png"></ZoomableImage>
                </div>
                <p className='accordion__body accordion-content-text'>
                  From that sample, I ran the validation query for each user individually. It returns the same output as before, but broken down row by row per course completion. User 8249's flag turns TRUE on 2025-02-28, which is consistent with the AI-generated query output.
                </p>
                <div className='accordion-images'>
                  <ZoomableImage src="/images/training-impact/framework-validation-2.png" />
                </div>
                <p className='accordion__body accordion-content-text'>
                  From there, I brought the view into Power BI alongside the other metric tables and built calculated columns that classify each event as trained or untrained based on whether they had crossed the threshold by the time that specific event happened.
                </p>
              </Accordion>

              <p>
                From there, I brought the view into Power BI alongside the other metric tables and built
                calculated columns that classify each event as trained or untrained based on whether they had
                crossed the threshold by the time that specific event happened.
              </p>

              <Accordion label="( ) Time-aware trained event DAX">
                <div>
                  <p className='accordion-content-query'>
                    {timeAwareTrainedEventDax}
                  </p>
                </div>
              </Accordion>
            </div>

            <br></br><br></br>

            <div className='tab-content'>
              <h3>One Measure, Two Modes</h3>
              <p>
                There's a difference between knowing the program is moving in the right direction and knowing
                which resource is driving it. My flexible Power BI measure handles the two; in its default
                state, it uses the general 50% baseline to classify users as trained or untrained.
              </p>
              <p>
                When a specific content is selected, it drops that baseline entirely and looks at whether the
                user completed that content before the measured event happened. Filtering down to a specific
                measure narrows the measured event too. Instead of overall feature adoption, the logic is
                scoped to that feature alone.
              </p>
              <div className="gif-standalone" style={{ maxWidth: '1000px' }}>
                <GifPlayImage
                  poster="/images/training-impact/one-measure-two-methods.png"
                  gif="/images/training-impact/one-measure-two-methods.gif"
                  alt="One measure operating in two modes"
                />
              </div>
              <p>
                This means the same report serves two different needs: consistent high-level tracking for
                program-level targets, and granular analysis for the individual contributors who own specific
                content.
              </p>
              <p>
                Designers are always told to anchor new resources to a business outcome before building
                anything. What that advice skips is the how. This framework is the closest I've gotten to
                answering that: before building, we can look at how an existing resource (if any) is already
                performing against its intended outcome and set a target. Once the updated or new resource is
                live, we have a way to find out whether it actually did anything.
              </p>

              <Accordion label="( ) Flexible trained user DAX">
                <div>
                  <p className='accordion-content-query'>
                    {flexibleTrainedUserDax}
                  </p>
                </div>
              </Accordion>
            </div>


            <br></br><br></br>

            <div className='tab-content'>
              <h3>Is Training Really Driving Improvement?</h3>
              <p>
                A simple average comparison that shows trained users perform better than untrained ones is a
                start, but it's not a strong signal on its own. Too many other things could explain the gap.
                So my goal was to find a pattern that holds across multiple methods, because if training
                consistently shows up as a positive signal regardless of how you look at it, at some point we
                can't ignore that training is doing something.
              </p>
              <p>
                The first addition is same-tenure comparison. By isolating users within their first six
                months on the platform, it strips out the performance gap that might come from simply having
                more experience with the product. If trained users still outperform untrained users at the
                same stage of their journey, we can eliminate tenure as the explanation of the gap.
              </p>

              <div className="accordion-images" style={{ maxWidth: '760px', margin: '0 auto' }}>
                <ZoomableImage src="/images/training-impact/same-tenure.png" alt="Same-tenure comparison" />
              </div>

              <Accordion label="( ) Same-tenure comparison DAX">
                <div>
                  <p className='accordion-content-query'>
                    {sameTenureComparisonDax}
                  </p>
                </div>
              </Accordion>

              <p>
                But that still leaves another problem: trained users might already be more engaged with the
                product before they ever touch a course. Or improvement over time might just be natural as
                people get better at tools they use regularly. That's when I came across
                Difference-in-differences (DiD) analysis.
              </p>
              <p>
                Instead of comparing where two groups end up, it measures how much each group changed before
                and after a training event, with untrained users as the control. Whatever improvement the
                untrained group made on their own gets subtracted out. What's left is the change that
                training can actually be attributed to.
              </p>
              <p>
                The analysis window defaults to three months before and after the training event, though
                readers can customize it anywhere from one to six months based on what they're investigating.
                For both groups, only users with measured events before and after the analysis window are
                included in the analysis to make sure the same population appears in both periods.
              </p>
              <p>
                These two additional methods use the same flexible approach as the simple average, 50%
                completion threshold by default with filter-based granularity for deeper analysis.
              </p>

              <div className="accordion-images" style={{ maxWidth: '760px', margin: '0 auto' }}>
                <ZoomableImage src="/images/training-impact/DiD.png" alt="Difference-in-differences analysis" />
              </div>

              <Accordion label="( ) DiD help DAX measures">
                <div>
                  <p className='accordion-content-query'>
                    {didHelpDax}
                  </p>
                </div>
              </Accordion>

              <Accordion label="( ) DiD intermediate DAX measures">
                <div>
                  <p className='accordion-content-query'>
                    {didIntermediateDax}
                  </p>
                </div>
              </Accordion>

              <Accordion label="( ) DiD final DAX">
                <div>
                  <p className='accordion-content-query'>
                    {didFinalDax}
                  </p>
                </div>
              </Accordion>

              <p>
                The next panel shows a period-over-period performance of key metrics which shows changes over
                time with WoW, MoM, and QoQ views. But it also works as a way to pressure-test specific
                efforts. For example, if we run a campaign to drive training engagement, I'd expect trained
                coverage to increase in the weeks after. If we launch targeted content on a specific feature,
                associated impact and DiD effect for that feature should follow. And when they do, it's one
                more data point that training is actually doing something.
              </p>
              <div className="accordion-images" style={{ maxWidth: '760px', margin: '0 auto' }}>
                <ZoomableImage src="/images/training-impact/Period-over-period.png" alt="Period-over-period performance" />
              </div>
              <br></br>
            </div>

            <br></br><br></br>

            <div className='tab-content'>
              <h3>Ask the Owl</h3>
              <p>
                As analytical complexity increases, reports become harder to navigate without proper context.
                Simplifying them might improve accessibility, but it also strips away the depth of signal
                needed to understand what's actually happening. Training measurement is inherently complex,
                and treating it otherwise will only lead to incomplete conclusions.
              </p>
              <p>
                So instead of simplifying the report, I built an interpreter for its readers. The bot is
                built on the Claude API, trained on the specific definitions, methodology, and logic behind
                this report. Readers can ask what a metric means, ask what a combination of results signals,
                or upload a screenshot and get a direct interpretation.
              </p>
              <p>This effort serves three purposes:</p>
              <ol className="about-list about-list--light">
                <li>
                  Stakeholders who might otherwise disengage when encountering unfamiliar concepts have a way
                  to navigate and understand the report.
                </li>
                <li>
                  The bot helps surface meaningful questions and guides readers toward the plausible
                  investigation areas.
                </li>
                <li>
                  Every interaction is logged, and what stakeholders ask while navigating a report of our
                  performance is a window into what they actually care about, what might confuse them, and
                  what they'd never think to bring to us directly.
                </li>
              </ol>
              <Carousel slides={askTheOwlSlides} placeholderLabel="Ask the Owl demo — image coming soon" />
            </div>

            <br></br><br></br>


            <div className="tab-content">
              <h3>Building for Maintainability</h3>
              <p>
                Earlier, I mentioned that my goal was to establish a consistent pattern here trained users
                outperform untrained ones across multiple metrics. That's why I knew from the start that
                whichever metric I started with, the underlying measures needed to be highly reusable.
                Changes to definitions should require minimal updates, and each metric should build on a
                shared foundation to make adding new ones straightforward.
              </p>
              <p>
                The report is built around a shared metric type that controls calculation logic and
                directional indicators. Adding a new metric is a controlled process where I duplicate an
                existing page, change the page-level filter, and every measure from simple comparison to DiD
                adapts automatically. If the trained definition changes, I only update one view in the data
                warehouse and every metric on every page will reflect it immediately.
              </p>

              <div className="gif-standalone" style={{ maxWidth: '1000px' }}>
                <GifPlayImage
                  poster="/images/training-impact/building-for-maintainability.png"
                  gif="/images/training-impact/building-for-maintainability.gif"
                  alt="One measure operating in two modes"
                />
              </div>
              <Accordion label="( ) Metric-based final DAX">
                <div>
                  <p className='accordion-content-query'>
                    {metricBasedFinalDax}
                  </p>
                </div>
              </Accordion>
            </div>
          </div> {/* last div before CTA */}
        </section>


        {/* MEASUREMENT NEEDS DIRECTION — closing + cross-link */}
        <section className="cta-section">
          <h3>Measurement Needs Direction</h3>
          <p>
            As the title suggests, this report is designed to measure training impact and to surface what
            is actually happening, not to prove that training works. Flat or inconsistent results are
            signals worth investigating, and the bot is there to prompt those questions and guide deeper
            exploration.
          </p>
          <p>
            At the same time, meaningful results come from building training intentionally to solve the
            right problems. The ability to analyze deeply and identify those problems is just as, if not
            more, important than measuring success.
          </p>
          <p >
            If you're interested in that side of the work, you can explore my other piece where I
            showcase how I identify the right problems to solve before any development work starts.
          </p>
          <a href="/needs-analysis" className="btn-secondary" style={{ marginTop: '12px' }}>
            Data &amp; AI for Needs Analysis
          </a>
        </section>

      </main>
      <Footer />
    </div>
  );
}
