import * as fs from 'fs';
import * as path from 'path';

import {
    COVER_BG,
    FOOTER_PULSIFI_LOGO,
    ICON_BAG,
    ICON_COGNITIVE,
    ICON_COMPETENCIES,
    ICON_EMAIL,
    ICON_FAQ,
    ICON_FLAG,
    ICON_HOUSE,
    ICON_OVERVIEW,
    ICON_PHONE,
    ICON_SCREENING,
    ICON_STAR,
    ICON_WORK_EXPERIENCE,
    ICON_WORK_INTERESTS,
    ICON_WORK_STYLES,
    ICON_WORK_VALUES,
} from './icons';
import { JobApplicationSkillProficiency } from './job-application-skill-proficiency.enum';
import { STYLE_TEMPLATE } from './styles';

export const HEAD_TEMPLATE = /*html*/ `
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>{{first_name}} {{last_name}} Report</title>

  ${STYLE_TEMPLATE}
</head>
`;

export const COVER_PAGE_TEMPLATE = /*html*/ `
<style>
  .title-card {
    position: relative;
    text-align: center;
  }
  .title-contents {
    display: flex;
    flex-direction: column;
    gap: var(--size-xss);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
  }
  .job-title {
    font-size: var(--size-sm);
    display: block;
  }
  .name {
    font-size: var(--font-size-bigger);
  }
</style>

<div class="page">
  <div class="title-card">
    ${COVER_BG}

    <div class="title-contents">
      <h3>{{company_name}}</h3>
      <span class="job-title">{{job_title}}</span>
      <h1 class="name">{{first_name}} {{last_name}}</h1>
    </div>
  </div>

  <div class="spacer-md">
    <div class="spacer-xs">
      <h1 class="uppercase">{{coverPage.introduction}}</h1>
      <p>
      {{{coverPage.introductionSummary}}}
      </p>
    </div>

    <div class="spacer-md">
      <h1 class="uppercase">{{coverPage.gainInsight}}</h1>
      <p>
      {{{coverPage.gainInsightSummary}}}
      </p>
      <p class="spacer-sm">{{coverPage.gainInsightFitScore}}</p>
      <p class="spacer-sm">{{coverPage.gainInsightHardSkills}}</p>
      <p class="spacer-sm">
      {{coverPage.gainInsightSoftTraits}}
      </p>
      <p class="spacer-sm">{{coverPage.gainInsightReadThisReport}}</p>
      <ul>
        <li>
        {{{coverPage.gainInsightReadThisReportPoint1}}}
        </li>
        <li>
        {{{coverPage.gainInsightReadThisReportPoint2}}}
        </li>
        <li>
        {{{coverPage.gainInsightReadThisReportPoint3}}}
        </li>
      </ul>
    </div>

    <div class="spacer-md">
      <h1 class="uppercase">{{coverPage.confidentiality}}</h1>
      <p>
      {{coverPage.confidentialitySummary}}
      </p>
    </div>
  </div>
</div>
`;

export const SUMMARY_TEMPLATE = /*html*/ `
<style>
  .summary {
    flex-wrap: wrap;
  }
  .profile-info {
    flex: 0 0 calc(50% - var(--size-lg));
    word-break: break-word;
  }
  .profile-info .icon {
    color: var(--color-blue);
  }
  .role-fit {
    flex: 1 1 auto;
  }
  .role-fit .value svg {
    height: var(--size-svg);
    margin-block-start: 1pt;
  }
  .tag-legend span::before {
    border-radius: 1pt;
    content: "";
    display: inline-block;
    height: 6pt;
    margin-inline-end: var(--size-xss);
    width: 6pt;
  }
  .tag-legend .matched::before {
    background-color: var(--color-blue);
  }
  .tag-legend .required::before {
    background-color: var(--color-tag-required);
    margin-left: 4pt;
  }
  .tag-legend .score-high::before {
    background-color: var(--color-score-high);
  }
  .tag-legend .score-average::before {
    background-color: var(--color-score-average);
    margin-left: 4pt;
  }
  .tag-legend .score-low::before {
    background-color: var(--color-score-low);
    margin-left: 4pt;
  }
  .crown-legend {
    font-size: 9pt;
    inset-block-end: var(--size-lg);
    inset-inline-start: 0;
    position: absolute;
    bottom: 0;
  }
  .crown-legend .icon-list {
    justify-content: flex-end;
    width: var(--size-lg);
    margin-right: 2pt;
  }
  .block {
    display: block;
  }
  .tag-legend span.before-ml-0::before {
    margin-left: 0;
  }
  .left {
      flex-grow: 1; /* Grow to occupy remaining space */
  }
  .right {
      flex-grow: 1; /* Grow to occupy remaining space */
      text-align: right; /* Align text to the right */
  }
  .spacing-left {
      margin-left: 5pt;
  }
</style>

<div class="page summary row">
  <div class="profile-info">
    <div>
      <h3>{{first_name}} {{last_name}}</h3>
      {{#if last_position}}
      <p>{{last_position}}</p>
      {{else}}
      <p>{{summaryPage.workExperienceNotAvailable}}</p>
      {{/if}} 
      
      {{#if contact_email}}
      <div class="icon-value-pair spacer-md">
        <div class="icon">${ICON_EMAIL}</div>
        <div class="value">{{contact_email}}</div>
      </div>
      {{/if}} 
      
      {{#if contact_mobile_number}}
      <div class="icon-value-pair">
        <div class="icon">${ICON_PHONE}</div>
        <div class="value">{{contact_mobile_number}}</div>
      </div>
      {{/if}} {{#if address}}
      <div class="icon-value-pair">
        <div class="icon">${ICON_HOUSE}</div>
        <div class="value">{{address}}</div>
      </div>
      {{/if}} {{#if nationality}}
      <div class="icon-value-pair">
        <div class="icon">${ICON_FLAG}</div>
        <div class="value">{{nationality}}</div>
      </div>
      {{/if}} 
      {{#if source}}
      <div class="icon-value-pair">
        <div class="icon">${ICON_BAG}</div>
        <div class="value">{{toCapitalizedWords source}}</div>
      </div>
      {{/if}}
    </div>
    {{#if job_title}}
    <div class="spacer-lg">
      <h1>{{summaryPage.appliedPosition}}</h1>
      <span>{{job_title}}</span>
    </div>
    {{/if}}
    <div class="spacer-md">
      <h1>{{summaryPage.applicationStage}}</h1>
      {{#if application_status}}
      <span
        >{{getTranslatedApplicationStatus application_status
        applicationStatusText}}</span
      >
      {{else}} <span>No applicant status available</span> {{/if}}
    </div>
    {{#if total_assessment_completed}}
    <div class="spacer-md">
      <h1>{{summaryPage.assessments}}</h1>
      <span>
        {{summaryPage.completedAssessment}}
        {{total_assessment_completed}}
        {{summaryPage.completedAssessmentOutOf}} {{total_assessment}}
      </span>
    </div>
    {{/if}}
    <div class="spacer-md">
      <h1>{{summaryPage.screeningStatus}}</h1>
      {{#if has_passed_screening}}
      <span>{{summaryPage.qualified}}</span> {{else}}
      <span>{{summaryPage.unQualified}}</span> {{/if}}
    </div>
    <div class="spacer-md">
      <h1>{{summaryPage.screeningTags}}</h1>
      {{#if screening_tags}}
      <div class="tag-container spacer-xss">
        {{#each screening_tags}}
        <label class="tag blue">{{this}}</label> {{/each}}
      </div>
      <div class="tag-legend spacer-xs">
        <span class="matched block">{{summaryPage.screeningTagsMatched}}</span>
        <span class="required block before-ml-0"
          >{{summaryPage.screeningTagsRequired}}</span
        >
      </div>
      {{else}}
      <span>{{summaryPage.screeningTagsNotAvailable}}</span> 
      {{/if}}
    </div>
  </div>
  <div class="profile-info">
    <div class="row">
        
      <div>
        <h1>
          <div class="icon-value-pair">
            <div class="icon">${ICON_STAR}</div>
            <div class="value">{{summaryPage.roleFit}}</div>
          </div>
        </h1>
      </div>
      <div>
      {{#if role_fit_score}}
      <h3 class="score {{colorizeScore role_fit_score}} spacing-left">
        {{convertFitScoreToPercentage role_fit_score}}%
      </h3>
      {{else}}
      <h3 class="spacing-left">{{summaryPage.roleFitNotAvailable}}</h3>
      {{/if}}
      </div>
    </div>

    <div class="indent-md">
      <div class="spacer-xs">
        <h1>{{summaryPage.breakDown}}</h1>
        <p><em> {{summaryPage.roleFitSummary}}</em></p>
        <div class="spacer-md row">
          <div><h2>{{summaryPage.componentWeightageHeader}}</h2></div>
          <div class="right"><h2>{{summaryPage.weightedScoreHeader}}</h2></div>
        </div>
        <div class="breakdown">
          {{#each assessment_scores.role_fit}} 
          {{#ifEquals ingredient_alias "work_style"}}
          <div class="spacer-xs">
            <div class="icon-value-pair">
              <div class="icon lighter">${ICON_WORK_STYLES}</div>
              <div class="value">
                <span>{{@root.summaryPage.workStyles}} - {{convertScoreToPercentage ingredient_weightage}}%</span>
              </div>
            </div>
            <div class="progress-bar row">
              <div class="bar">
                <div
                  class="{{generateProgressBarFill ingredient_score}}"
                  style="width: {{calculateBarWidthWithIngredients ingredient_weightage ingredient_weighted_score}}%;"></div>
              </div>
              <div class="spacing-left"> 
                {{convertScoreToPercentage ingredient_weighted_score}}%
              </div>
            </div>
          </div>
          {{/ifEquals}} 
          
          {{#ifEquals ingredient_alias "interest_riasec"}}
          <div class="spacer-xs">
            <div class="icon-value-pair">
              <div class="icon lighter">${ICON_WORK_INTERESTS}</div>
              <div class="value">
                <span
                  >{{@root.summaryPage.workInterests}} -
                  {{convertScoreToPercentage
                  ingredient_weightage}}%</span
                >
              </div>
            </div>
            <div class="progress-bar row">
              <div class="bar">
                <div
                  class="{{generateProgressBarFill ingredient_score}}"
                  style="width: {{calculateBarWidthWithIngredients ingredient_weightage ingredient_weighted_score}}%;"
                ></div>
              </div>
              <div class="spacing-left">
                {{convertScoreToPercentage ingredient_weighted_score}}%
              </div>
            </div>
          </div>
          {{/ifEquals}} 
          
          {{#ifEquals ingredient_alias "work_value"}}
          <div class="spacer-xs">
            <div class="icon-value-pair">
              <div class="icon lighter">${ICON_WORK_VALUES}</div>
              <div class="value">
                <span
                  >{{@root.summaryPage.workValues}} -
                  {{convertScoreToPercentage
                  ingredient_weightage}}%</span
                >
              </div>
            </div>
            <div class="progress-bar row">
              <div class="bar">
                <div
                  class="{{generateProgressBarFill ingredient_score}}"
                  style="width: {{calculateBarWidthWithIngredients ingredient_weightage ingredient_weighted_score}}%;"
                ></div>
              </div>
              <div class="spacing-left">
                {{convertScoreToPercentage ingredient_weighted_score}}%
              </div>
            </div>
          </div>
          {{/ifEquals}} 
          
          {{#ifEquals ingredient_alias "hard_skills"}}
          <div class="spacer-xs">
            <div class="icon-value-pair">
              <div class="icon lighter">${ICON_COMPETENCIES}</div>
              <div class="value">
                <span>{{@root.summaryPage.competencies}} - {{convertScoreToPercentage ingredient_weightage}}%</span>
              </div>
            </div>
            <div class="progress-bar row">
              <div class="bar">
                <div
                  class="{{generateProgressBarFill ingredient_score}}"
                  style="width: {{calculateBarWidthWithIngredients ingredient_weightage ingredient_weighted_score}}%;"
                ></div>
              </div>
              <div class="spacing-left">
                {{convertScoreToPercentage ingredient_weighted_score}}%
              </div>
            </div>
          </div>
          {{/ifEquals}} 
          
          {{#ifEquals ingredient_alias "work_experience"}}
          <div class="spacer-xs">
            <div class="icon-value-pair">
              <div class="icon lighter">${ICON_WORK_EXPERIENCE}</div>
              <div class="value">
                <span>{{@root.summaryPage.workExperience}} - {{convertScoreToPercentage ingredient_weightage}}%</span>
              </div>
            </div>
            <div class="progress-bar row">
              <div class="bar">
                <div 
                  class="{{generateProgressBarFill ingredient_score}}"
                  style="width: {{calculateBarWidthWithIngredients ingredient_weightage ingredient_weighted_score}}%;">
                </div>
              </div>
              <div class="spacing-left">
                {{convertScoreToPercentage ingredient_weighted_score}}%
              </div>
            </div>
          </div>
          {{/ifEquals}}
          
          {{#ifEquals ingredient_alias "reasoning_logical"}}
          <div class="spacer-xs">
            <div class="icon-value-pair">
              <div class="icon lighter">${ICON_COGNITIVE}</div>
              <div class="value">
                <span>{{@root.cognitiveAbilitiesPage.cognitiveAbilitiesReasoningLogical}} - {{convertScoreToPercentage ingredient_weightage}}%</span>
              </div>
            </div>
            <div class="progress-bar row">
              <div class="bar">
                <div
                  class="{{generateProgressBarFill ingredient_score}}"
                  style="width: {{calculateBarWidthWithIngredients ingredient_weightage ingredient_weighted_score}}%;"
                ></div>
              </div>
              <div class="spacing-left">
                {{convertScoreToPercentage ingredient_weighted_score}}%
              </div>
            </div>
          </div>
          {{/ifEquals}} 
          
          {{#ifEquals ingredient_alias "reasoning_verbal"}}
          <div class="spacer-xs">
            <div class="icon-value-pair">
              <div class="icon lighter">${ICON_COGNITIVE}</div>
              <div class="value">
                <span
                  >{{@root.cognitiveAbilitiesPage.cognitiveAbilitiesReasoningVerbal}}
                  - {{convertScoreToPercentage
                  ingredient_weightage}}%</span
                >
              </div>
            </div>
            <div class="progress-bar row">
              <div class="bar">
                <div
                  class="{{generateProgressBarFill ingredient_score}}"
                  style="width: {{calculateBarWidthWithIngredients ingredient_weightage ingredient_weighted_score}}%;"
                ></div>
              </div>
              <div class="spacing-left">
                {{convertScoreToPercentage ingredient_weighted_score}}%
              </div>
            </div>
          </div>
          {{/ifEquals}} 
          
          {{#ifEquals ingredient_alias "reasoning_numeric"}}
          <div class="spacer-xs">
            <div class="icon-value-pair">
              <div class="icon lighter">${ICON_COGNITIVE}</div>
              <div class="value">
                <span>{{@root.cognitiveAbilitiesPage.cognitiveAbilitiesReasoningNumeric}} - {{convertScoreToPercentage ingredient_weightage}}%</span>
              </div>
            </div>
            <div class="progress-bar row">
              <div class="bar">
                <div
                  class="{{generateProgressBarFill ingredient_score}}"
                  style="width: {{calculateBarWidthWithIngredients ingredient_weightage ingredient_weighted_score}}%;"
                ></div>
              </div>
              <div class="spacing-left">
                {{convertScoreToPercentage ingredient_weighted_score}}%
              </div>
            </div>
          </div>
          {{/ifEquals}} 
          
          {{/each}}
          <div class="tag-legend row spacer-xs">
            <span class="score-high">{{summaryPage.breakdownLegendHigh}}</span>
            <span class="score-average">{{summaryPage.breakdownLegendAverage}}</span>
            <span class="score-low">{{summaryPage.breakdownLegendLow}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="profile-info spacer-md">
    <h1 class="icon-value-pair">
      <div class="icon">${ICON_COMPETENCIES}</div>
      <div class="value">{{summaryPage.competencies}}</div>
    </h1>
    <p><em> {{summaryPage.competenciesInformation}} </em></p>
    {{#if assessment_scores.hard_skills}}
    <div class="tag-container spacer-xss">
      {{#each assessment_scores.hard_skills}}
      <label class="tag {{generateHeatTag @index score}}">{{name}} - {{convertScoreToPercentage score}}%</label>
      {{/each}}
    </div>
    {{else}}
    <p>{{summaryPage.competenciesNotAvailable}}</p>
    {{/if}}
  </div>
  <div class="spacer-md" style="flex: 0 0 calc(55% - var(--size-lg)); word-break: break-word;">
      <h1 class="icon-value-pair">
        <div class="icon">${ICON_WORK_EXPERIENCE}</div>
        <div class="value">{{summaryPage.workExperience}}</div>
      </h1>
      <p><em> {{summaryPage.workExperienceInformation}} </em></p>
      {{#if assessment_scores.work_experience}}
      <div class="tag-container spacer-xss">
        {{#each assessment_scores.work_experience}}
        <label class="tag {{generateHeatTag @index score}}">{{name}} - {{convertScoreToPercentage score}}%</label>
        {{/each}}
      </div>
      {{else}}
      <p>{{summaryPage.workExperienceNotAvailable}}</p>
      {{/if}}
  </div>
</div>
`;

export const SCREENING_TEMPLATE = /*html*/ `
<style>
  .screening-list li::marker {
    color: var(--color-primary);
    font-weight: 700;
  }
</style>

<div class="page">
  <h1>
    <div class="icon-value-pair">
      <div class="icon">${ICON_SCREENING}</div>
      <div class="value uppercase">{{screeningPage.screeningQuestionsResponse}}</div>
    </div>
  </h1>

  <div class="screening-list">
    {{#if screening_answers}}
      <ol>
        {{#each screening_answers}}
          <li class="one-piece spacer-md">
            <h2>{{question}}</h2>
            <p>{{answer}}</p>
          </li>
        {{/each}}
      </ol>
    {{else}}
      <p class="indent-md spacer-md">{{screeningPage.screeningQuestionsResponseNotAvailable}}</p>
    {{/if}}
  </div>
</div>
`;

export const OVERVIEW_TEMPLATE = /*html*/ `
<div class="page">
  <h1>
    <div class="icon-value-pair">
      <div class="icon">${ICON_OVERVIEW}</div>
      <div class="value uppercase">{{overviewPage.overviewTitle}}</div>
    </div>
  </h1>

  <p>
    <em>
      {{overviewPage.overviewSummary}}
    </em>
  </p>

  <div class="indent-md">
    <div class="spacer-md">
      <h1>{{overviewPage.whatMakes}} {{first_name}} {{overviewPage.whatMakesGreat}}</h1>
      <div>
        {{#if assessment_descriptor_overview.working_with}}
          <ul>
            {{#each assessment_descriptor_overview.working_with}}
              <li>{{name}}</li>
            {{/each}}
          </ul>
        {{else}}
          <p>{{overviewPage.traitsNotDetected}}</p>
        {{/if}}
      </div>
    </div>

    <div class="spacer-md">
      <h1>{{overviewPage.whatMakes}} {{first_name}} {{overviewPage.whatMakesThrive}}</h1>
      <div>
        {{#if assessment_descriptor_overview.thrive}}
          <ul>
            {{#each assessment_descriptor_overview.thrive}}
              <li>{{name}}</li>
            {{/each}}
          </ul>
        {{else}}
          <p>{{overviewPage.traitsNotDetected}}</p>
        {{/if}}
      </div>
    </div>

    <div class="spacer-md">
      <h1>{{overviewPage.whatToLookOutFor}} {{first_name}}</h1>
      <div>
        {{#if assessment_descriptor_overview.watch_out}}
          <ul>
            {{#each assessment_descriptor_overview.watch_out}}
              <li>{{name}}</li>
            {{/each}}
          </ul>
        {{else}}
          <p>{{overviewPage.issuesNotDetected}}</p>
        {{/if}}
      </div>
    </div>
  </div>
</div>
`;

export const CULTURE_FIT_TEMPLATE = /*html*/ `
<div class="page">
  <h1>
    <div class="icon-value-pair">
      <div class="icon">${ICON_STAR}</div>
      <div class="value">{{cultureFitPage.organizationFit}} - {{culture_fit_framework_name}}</div>
    </div>
  </h1>

  <h3 class="indent-md score {{colorizeScore culture_fit_score}}">
    {{convertFitScoreToPercentage culture_fit_score}}%
  </h3>

  {{#if assessment_scores.culture_fit}}
    <div class="chart-container">
      <div id="culture_fit"></div>
    </div>

    <div class="indent-md">
      {{#each assessment_scores.culture_fit}}
        <div class="one-piece spacer-md">
          <h1 class="with-dimension">
            {{domain_name}} - {{convertScoreToPercentage domain_score}}%

            {{#if dimension_level}}
              <span class="dimension {{dimension_level}}">
                {{dimension_level}}
              </span>
            {{/if}}
          </h1>

          {{#if descriptor}}
            <p>{{descriptor}}</p>
          {{/if}}
        </div>
      {{/each}}
    </div>
  {{else}}
    <p class="indent-md spacer-md">{{cultureFitPage.notAvailable}}</p>
  {{/if}}
</div>
`;

export const WORK_STYLES_TEMPLATE = /*html*/ `
<style>
  .chart-container.work-styles {
    height: 350pt;
  }
</style>

<div class="page">
  <h1>
    <div class="icon-value-pair">
      <div class="icon">${ICON_WORK_STYLES}</div>
      <div class="value uppercase">{{workStylesPage.workStyles}}</div>
    </div>
  </h1>

  <p>
    <em>
    {{workStylesPage.workStylesSummary}}
    </em>
  </p>

  {{#if assessment_scores.work_style}}
    <div class="chart-container work-styles">
      <div id="work_style"></div>
    </div>

    <div class="indent-md">
      {{#each assessment_scores.work_style}}
        <div class="one-piece spacer-md">
          <h1 class="with-dimension">
            {{domain_name}} - {{convertScoreToPercentage domain_score}}%
            <span class="dimension {{dimension_level}}">
              {{dimension_level}}
            </span>
          </h1>

          {{#if descriptor}}
            <p>{{descriptor}}</p>
          {{/if}}
        </div>
      {{/each}}
    </div>
  {{else}}
    <p class="indent-md spacer-md">{{workStylesPage.notAvailable}}</p>
  {{/if}}
</div>
`;

export const WORK_INTERESTS_TEMPLATE = /*html*/ `
<div class="page">
  <h1>
    <div class="icon-value-pair">
      <div class="icon">${ICON_WORK_INTERESTS}</div>
      <div class="value uppercase">{{workInterestPage.workInterests}}</div>
    </div>
  </h1>

  <p>
    <em>
    {{{workInterestPage.workInterestsSummary}}}
    </em>
  </p>

  {{#if assessment_scores.work_interest}}
    <div class="chart-container">
      <div id="work_interest"></div>
    </div>

    <div class="indent-md">
      {{#each assessment_scores.work_interest}}
        <div class="one-piece spacer-md">
          <h1 class="with-dimension">
            {{domain_name}} - {{convertScoreToPercentage domain_score}}%
          </h1>

          {{#if descriptor}}
          <p>{{descriptor}}</p>
          {{/if}}
        </div>
      {{/each}}
    </div>
  {{else}}
    <p class="indent-md spacer-md">{{workInterestPage.notAvailable}}</p>
  {{/if}}
</div>
`;

export const WORK_VALUES_TEMPLATE = /*html*/ `
<div class="page">
  <h1>
    <div class="icon-value-pair">
      <div class="icon">${ICON_WORK_VALUES}</div>
      <div class="value uppercase">{{workValuesPage.workValues}}</div>
    </div>
  </h1>

  <p>
    <em>
    {{{workValuesPage.workValuesSummary}}}
    </em>
  </p>

  {{#if assessment_scores.work_value}}
    <div class="chart-container">
      <div id="work_value"></div>
    </div>

    <div class="indent-md">
      {{#each assessment_scores.work_value}}
        <div class="one-piece spacer-md">
          <h1 class="with-dimension">
            {{domain_name}} - {{convertScoreToPercentage domain_score}}%
            <span class="dimension {{dimension_level}}">
              {{dimension_level}}
            </span>
          </h1>

          {{#if descriptor}}
            <p>{{descriptor}}</p>
          {{/if}}
        </div>
      {{/each}}
    </div>
  {{else}}
    <p class="indent-md spacer-md">{{workValuesPage.notAvailable}}</p>
  {{/if}}
</div>
`;

export const COGNITIVE_ABILITIES_TEMPLATE = /*html*/ `
<div class="page">
  <h1>
    <div class="icon-value-pair">
      <div class="icon">${ICON_COGNITIVE}</div>
      <div class="value uppercase">{{cognitiveAbilitiesPage.cognitiveAbilities}}</div>
    </div>
  </h1>

  <p>
    <em>
    {{{cognitiveAbilitiesPage.cognitiveAbilitiesSummary}}}
    </em>
  </p>

  <div class="indent-md">
    {{#if assessment_scores.reasoning_average}}
    
      {{#if assessment_scores.reasoning_logical}}
        {{#if assessment_scores.reasoning_logical.percentile includeZero=true}}
          <div class="spacer-md">
            <div><span>{{cognitiveAbilitiesPage.cognitiveAbilitiesReasoningLogical}}</span></div>

            <div class="progress-bar row">
              <div class="bar full-width">
                <div class="fill" style="width: {{convertScoreToPercentage assessment_scores.reasoning_logical.score}}%;"></div>
              </div>

              <div>{{convertScoreToPercentage assessment_scores.reasoning_logical.score}}%</div>
            </div>
            <p>{{cognitiveAbilitiesPage.percentileBetterThan}} {{convertScoreToPercentage assessment_scores.reasoning_logical.percentile}}% {{cognitiveAbilitiesPage.percentileOfOtherCandidates}}</p>

          </div>
        {{/if}}
      {{/if}}
      
      {{#if assessment_scores.reasoning_verbal}}
        {{#if assessment_scores.reasoning_verbal.percentile includeZero=true}}
          <div class="spacer-md">
            <div><span>{{cognitiveAbilitiesPage.cognitiveAbilitiesReasoningVerbal}}</span></div>

            <div class="progress-bar row">
              <div class="bar full-width">
                <div class="fill" style="width: {{convertScoreToPercentage assessment_scores.reasoning_verbal.score}}%;"></div>
              </div>

              <div>{{convertScoreToPercentage assessment_scores.reasoning_verbal.score}}%</div>
            </div>
            <p>{{cognitiveAbilitiesPage.percentileBetterThan}} {{convertScoreToPercentage assessment_scores.reasoning_verbal.percentile}}% {{cognitiveAbilitiesPage.percentileOfOtherCandidates}}</p>

          </div>
        {{/if}}
      {{/if}}
    
      {{#if assessment_scores.reasoning_numeric}}
        {{#if assessment_scores.reasoning_numeric.percentile includeZero=true}}
          <div class="spacer-md">
            <div><span>{{cognitiveAbilitiesPage.cognitiveAbilitiesReasoningNumeric}}</span></div>

            <div class="progress-bar row">
              <div class="bar full-width">
                <div class="fill" style="width: {{convertScoreToPercentage assessment_scores.reasoning_numeric.score}}%;"></div>
              </div>

              <div>{{convertScoreToPercentage assessment_scores.reasoning_numeric.score}}%</div>
            </div>
            <p>{{cognitiveAbilitiesPage.percentileBetterThan}} {{convertScoreToPercentage assessment_scores.reasoning_numeric.percentile}}% {{cognitiveAbilitiesPage.percentileOfOtherCandidates}}</p>
          </div>
        {{/if}}
      {{/if}}

    {{else}}
      <p class="indent-md spacer-md">{{cognitiveAbilitiesPage.notAvailable}}</p>
    {{/if}}
  </div>
</div>
`;

export const COMPETENCIES_TEMPLATE = /*html*/ `
<style>
.skills-list {
  display: flex;
}

.skills-list p {
  color: initial;
  min-width: 100px;
  margin-right: 10px;
}

.experience-info p {
  color: initial;
}

.bigger-subtitle {
  font-size: 1.25em;
  line-height: 1.25em;
}

.dashed {
  transform: translateY(-25%);
}
</style>

<div class="page">
  <h1>
    <div class="icon-value-pair">
      <div class="icon">${ICON_BAG}</div>
      <div class="value uppercase">{{experiencesPage.skills}} & {{experiencesPage.experience}}</div>
    </div>
  </h1>

  <div class="spacer-md">
    <h1 class="bigger-subtitle">{{experiencesPage.professionalSummary}}</h1>
    <pre>{{#if experiences.professional_summary}}{{experiences.professional_summary}}{{else}}{{experiencesPage.professionalSummaryNotAvailable}}{{/if}}</pre>
  </div>

  <div class="spacer-md">
    <h1>
      <div class="icon-value-pair">
        <div class="icon">${ICON_OVERVIEW}</div>
        <div class="value">{{overviewPage.overviewTitle}}</div>
      </div>
    </h1>

    <p>
      <em>
        {{overviewPage.overviewSummary}}
      </em>
    </p>

    <div class="indent-md">
      <div class="spacer-md">
        <h1>{{overviewPage.whatMakes}} {{first_name}} {{overviewPage.whatMakesGreat}}</h1>
        <div>
          {{#if assessment_descriptor_overview.working_with}}
            <ul>
              {{#each assessment_descriptor_overview.working_with}}
                <li>{{name}}</li>
              {{/each}}
            </ul>
          {{else}}
            <p>{{overviewPage.traitsNotDetected}}</p>
          {{/if}}
        </div>
      </div>

      <div class="spacer-md">
        <h1>{{overviewPage.whatMakes}} {{first_name}} {{overviewPage.whatMakesThrive}}</h1>
        <div>
          {{#if assessment_descriptor_overview.thrive}}
            <ul>
              {{#each assessment_descriptor_overview.thrive}}
                <li>{{name}}</li>
              {{/each}}
            </ul>
          {{else}}
            <p>{{overviewPage.traitsNotDetected}}</p>
          {{/if}}
        </div>
      </div>

      <div class="spacer-md">
        <h1>{{overviewPage.whatToLookOutFor}} {{first_name}}</h1>
        <div>
          {{#if assessment_descriptor_overview.watch_out}}
            <ul>
              {{#each assessment_descriptor_overview.watch_out}}
                <li>{{name}}</li>
              {{/each}}
            </ul>
          {{else}}
            <p>{{overviewPage.issuesNotDetected}}</p>
          {{/if}}
        </div>
      </div>
    </div>
  
  </div>

  <div class="spacer-lg">
    <h1 class="bigger-subtitle">{{experiencesPage.skills}}</h1>
    <p>{{experiencesPage.addedByCandidateWhenApplyingToThisRole}}</p>
    {{#groupBy experiences.skills 'proficiency'}}
      <!-- Expert proficiency -->
      <div class="skills-list">
        <p>{{../experiencesPage.expert}}</p>
        <div class="tag-container spacer-xss">
          {{#if this.${JobApplicationSkillProficiency.EXPERT}}}
            {{#each this.${JobApplicationSkillProficiency.EXPERT}}}
              <label class="tag">{{name}}</label>
            {{/each}}
          {{else}}
            <p class="dashed">--</p>
          {{/if}}
        </div>
      </div>

      <!-- Proficient proficiency -->
      <div class="skills-list">
        <p>{{../experiencesPage.proficient}}</p>
        <div class="tag-container spacer-xss">
          {{#if this.${JobApplicationSkillProficiency.PROFICIENT}}}
            {{#each this.${JobApplicationSkillProficiency.PROFICIENT}}}
              <label class="tag">{{name}}</label>
            {{/each}}
          {{else}}
            <p class="dashed">--</p>
          {{/if}}
        </div>
      </div>

      <!-- Competent proficiency -->
      <div class="skills-list">
        <p>{{../experiencesPage.competent}}</p>
        <div class="tag-container spacer-xss">
          {{#if this.${JobApplicationSkillProficiency.COMPETENT}}}
            {{#each this.${JobApplicationSkillProficiency.COMPETENT}}}
              <label class="tag">{{name}}</label>
            {{/each}}
          {{else}}
            <p class="dashed">--</p>
          {{/if}}
        </div>
      </div>

      <!-- Beginner proficiency -->
      <div class="skills-list">
        <p>{{../experiencesPage.beginner}}</p>
        <div class="tag-container spacer-xss">
          {{#if this.${JobApplicationSkillProficiency.BEGINNER}}}
            {{#each this.${JobApplicationSkillProficiency.BEGINNER}}}
              <label class="tag">{{name}}</label>
            {{/each}}
          {{else}}
            <p class="dashed">--</p>
          {{/if}}
        </div>
      </div>

      <!-- Novice proficiency -->
      <div class="skills-list">
        <p>{{../experiencesPage.novice}}</p>
        <div class="tag-container spacer-xss">
          {{#if this.${JobApplicationSkillProficiency.NOVICE}}}
            {{#each this.${JobApplicationSkillProficiency.NOVICE}}}
              <label class="tag">{{name}}</label>
            {{/each}}
          {{else}}
            <p class="dashed">--</p>
          {{/if}}
        </div>
      </div>
    {{/groupBy}}
  </div>
</div>
`;

export const EXPERIENCE_TEMPLATE = /*html*/ `
<style>
.skills-list {
  display: flex;
}

.skills-list p {
  color: initial;
  min-width: 100px;
  margin-right: 10px;
}

.experience-info p {
  color: initial;
}

.bigger-subtitle {
  font-size: 1.25em;
  line-height: 1.25em;
}

.dashed {
  transform: translateY(-25%);
}
</style>

<div class="page">
  <div class="spacer-lg">
    {{#if experiences.careers.length}}
      {{#each experiences.careers}}
        <div class="one-piece">
          {{#unless @index}}<h1 class="bigger-subtitle">{{../experiencesPage.workExperience}}</h1>{{/unless}}
          <div class="{{#if @index}}spacer-md{{/if}}">
            <div class="experience-info">
              <p>{{role}} {{../experiencesPage.at}} {{organization}}</p>
              <p>{{formatMonthYearByLocaleAndTimezone start_date @root/language @root/timezone}} -
                {{#if is_current}}
                  {{../experiencesPage.present}}
                {{else}}
                  {{formatMonthYearByLocaleAndTimezone end_date @root/language @root/timezone}}
                {{/if}}
              </p>
              <p>{{place_formatted_address}}</p>
            </div>
            <pre>{{{responsibilities_achievements}}}</pre>
          </div>
        </div>
      {{/each}}
    {{else}}
      <div class="one-piece">
        <h1 class="bigger-subtitle">{{experiencesPage.workExperience}}</h1>
        <p>{{experiencesPage.workExperienceNotAvailable}}</p>
      </div>
    {{/if}}
  </div>

  <div class="spacer-lg">
    {{#if experiences.educations.length}}
      {{#each experiences.educations}}
        <div class="one-piece">
          {{#unless @index}}<h1 class="bigger-subtitle">{{../experiencesPage.education}}</h1>{{/unless}}
          <div class="{{#if @index}}spacer-md{{/if}}">
            <div class="experience-info">
              <p>{{toCapitalizedWords degree_name}} {{../experiencesPage.in}} {{major_first}} {{../experiencesPage.at}} {{school_name}}</p>
              {{#if major_second}}<p>{{../experiencesPage.secondMajor}} {{../experiencesPage.in}} {{major_second}}</p>{{/if}}
              <p>{{formatMonthYearByLocaleAndTimezone start_date @root/language @root/timezone}} - {{formatMonthYearByLocaleAndTimezone end_date @root/language @root/timezone}}</p>
              {{#if grade_cgpa}}<p>{{../experiencesPage.cgpa}} {{toOneDecimal grade_cgpa}}</p>{{/if}}
            </div>
            <pre>{{{achievements}}}</pre>
          </div>
        </div>
      {{/each}}
    {{else}}
      <div class="one-piece">
        <h1 class="bigger-subtitle">{{experiencesPage.education}}</h1>
        <p>{{experiencesPage.educationNotAvailable}}</p>
      </div>
    {{/if}}
  </div>
</div>
`;

export const FAQ_TEMPLATE = /*html*/ `
<style>
  .faq-list li::marker {
    color: var(--color-primary);
    font-weight: 700;
  }
</style>

<div class="page">
  <h1>
    <div class="icon-value-pair">
      <div class="icon">${ICON_FAQ}</div>
      <div class="value uppercase">{{faqPage.frequentlyAskedQuestions}}</div>
    </div>
  </h1>

  <ol class="faq-list">
    <li class="spacer-md">
      <h2>{{{faqPage.whatsTheBestWayToRead}}}</h2>
      <p>
      {{{faqPage.whatsTheBestWayToReadSummary}}}
      </p>
      <p class="spacer-xs">
      {{{faqPage.whatsTheBestWayToReadSummaryParagraph2}}}
      </p>
      <p class="spacer-xs">
      {{{faqPage.whatsTheBestWayToReadSummaryParagraph3}}}
      </p>
    </li>

    <li class="spacer-md">
      <h2>{{faqPage.howDoIInterpretFitScore}}</h2>
      <p>
      {{{faqPage.howDoIInterpretFitScoreParagraph1}}}
      </p>
      <p class="spacer-xs">
      {{{faqPage.howDoIInterpretFitScoreParagraph2}}}
      </p>
      <p class="spacer-xs">
      {{{faqPage.howDoIInterpretFitScoreParagraph3}}}
      </p>
    </li>

    <li class="spacer-md">
      <h2>
      {{faqPage.WhySomeInsightStatementNegative}}
      </h2>
      <p class="spacer-xs">
      {{faqPage.WhySomeInsightStatementNegativeParagraph}}
      </p>
      <p class="spacer-xs">
      {{faqPage.WhySomeInsightStatementNegativeParagraph2}}
      </p>
    </li>

    <li class="spacer-md">
      <h2>
      {{faqPage.howDoIChooseBetween2Candidates}}
      </h2>
      <p>
      {{{faqPage.howDoIChooseBetween2CandidatesParagraph}}}
      </p>
    </li>
    
    <li class="spacer-md">
      <h2>
      {{faqPage.howDoeWeAssessHowAnIndividualPerform}}
      </h2>
      <p>
      {{faqPage.howDoeWeAssessHowAnIndividualPerformParagraph}}
      </p>
    </li>

    <li class="spacer-md">
      <h2>{{faqPage.areCertainTraitBetter}}</h2>
      <p>
      {{{faqPage.areCertainTraitBetterParagraph}}}
      </p>
    </li>

    <li class="spacer-md one-piece">
      <h2>{{faqPage.besideHiringHowCanThisReportHelpMe}}</h2>
      <p>
      {{{faqPage.besideHiringHowCanThisReportHelpMeParagraph}}}
      </p>
    </li>
  </ol>
</div>
`;
export const BODY_TEMPLATE = /*html*/ `
<main>
  <div>
    <!-- Cover Page -->
    ${COVER_PAGE_TEMPLATE}

    <!-- Page 1: Summary -->
    ${SUMMARY_TEMPLATE}

    <!-- Page 2: Screening Questions -->
    ${SCREENING_TEMPLATE}

    <!-- Page 4: Culture Fit-->
    {{#if assessment_scores.culture_fit}}
      ${CULTURE_FIT_TEMPLATE}
    {{/if}}

    <!-- Page 5: Work Style -->
    ${WORK_STYLES_TEMPLATE}

    <!-- Page 6: Work Interest -->
    ${WORK_INTERESTS_TEMPLATE}

    <!-- Page 7: Work Values/Motivations -->
    ${WORK_VALUES_TEMPLATE}

    <!-- Page 8: Cognitive Ability -->
    ${COGNITIVE_ABILITIES_TEMPLATE}

    <!-- Page 9: Experience -->
    {{#if experiences}}
      ${COMPETENCIES_TEMPLATE}

      ${EXPERIENCE_TEMPLATE}
    {{/if}}

    <!-- Page 10: FAQ -->
    ${FAQ_TEMPLATE}
  </div>
</main>
`;

export const SCRIPT_TEMPLATE = /*html*/ `
<script>
${fs.readFileSync(
    path.resolve(
        process.cwd(),
        !!!process.env.TS_JEST
            ? './src/script/g2plot-script.txt'
            : 'assets/script/g2plot-script.txt',
    ),
    'utf8',
)}
</script>
<script>
  window.assessment_scores = {{json assessment_scores}};

  const lightGray = "rgba(0, 0, 0, 0.04)";
  const G2LabelStyles = {
    fontFamily: "'Fira Sans', sans-serif",
    fill: "#646464",
  };

  window.barOptions = (data) => {
    return {
      data,
      pixelRatio: 300 / 72,
      appendPadding: 16,
      xField: "domain_score",
      yField: "domain_name",
      meta: {
        domain_score: {
          ticks: [0, 20, 40, 60, 80, 100],
        },
      },
      legend: {
        position: "top-left",
      },
      xAxis: {
        label: {
          style: {
            ...G2LabelStyles,
          },
        },
      },
      yAxis: {
        label: {
          style: {
            ...G2LabelStyles,
          },
        },
      },
      barStyle: (item) => {
        if (item.domain_score > 70) {
          return { fill: "#8ce024" };
        }

        if (item.domain_score < 30) {
          return { fill: "#f2466e" };
        }

        return { fill: "#f7b800" };
      },
      barBackground: {
        style: {
          fill: lightGray,
          fillOpacity: 1,
        },
      },
      interactions: [{ type: "active-region", enable: false }],
    };
  };

  window.radarOptions = (data) => {
    return {
      data,
      pixelRatio: 300 / 72,
      appendPadding: 16,
      xField: "domain_name",
      yField: "domain_score",
      autoFit: true,
      height: 480,
      meta: {
        domain_score: {
          ticks: [0, 20, 40, 60, 80, 100],
        },
      },
      xAxis: {
        tickLine: null,
        label: {
          style: (item) => {
            const styles = G2LabelStyles;

            const a = data.find((d) => {
              return d.domain_name === item;
            });

            if (a?.required_dimension_level === "high") {
              return { ...styles, fill: "#875eff" };
            }

            return styles;
          },
        },
      },
      yAxis: {
        maxLimit: 10,
        grid: {
          alternateColor: lightGray,
        },
        label: {
          style: {
            ...G2LabelStyles,
          },
        },
      },
      area: {
        style: {
          fill: "l(270) 0:rgba(47, 84, 235, 1) 1:rgba(47, 167, 235, 1)",
        },
      },
      color: "#0090ff",
      point: {
        size: 2,
      },
    };
  };
</script>
`;

export const FOOTER_TEMPLATE = `
<style>
    .footer {
        align-items: center;
        box-sizing: border-box;
        color: #979797;
        display: flex;
        font-family: 'Fira Sans', sans-serif;
        font-size: 8px;
        justify-content: space-between;
        line-height: 1.5;
        margin: 0;
        padding: 0 50px 35px;
        width: 100%;
    }
    .footer-body {
        align-items: center;
        display: flex;
        gap: 8px;
    }
    .footer-body p {
        margin: 0;
    }
</style>
<footer class="footer">
    <div class="footer-body">
        <div>${FOOTER_PULSIFI_LOGO}</div>
        <div>
            <p>
                {{first_name}} {{last_name}} - {{job_title}},
                {{company_name}}
            </p>
            <p>
                © Pulsifi. {{footerPage.allRightsReserved}} {{footerPage.reportGeneratedOn}} {{current_date}}
            </p>
        </div>
    </div>
    <div class="footer-page">
        <span class="pageNumber"></span>
    </div>
</footer>
                `;

export const HTML_TEMPLATE = /*html*/ `
<!DOCTYPE html>
<html lang="en">
  ${HEAD_TEMPLATE}
  <body>
    ${BODY_TEMPLATE}
    ${SCRIPT_TEMPLATE}
  </body>
</html>
`;
