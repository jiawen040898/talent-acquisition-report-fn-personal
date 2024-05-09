import { COVER_BG, FOOTER_PULSIFI_LOGO, ICON_STAR } from './icons';
import { STYLE_TEMPLATE } from './styles';
import { SCRIPT_TEMPLATE } from './template';

export const INTERVIEW_REPORT_HEAD_TEMPLATE = /*html*/ `
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
<title>{{first_name}} {{last_name}} Interview Response Report</title>
${STYLE_TEMPLATE}
</head>
`;

export const INTERVIEW_COVER_PAGE_TEMPLATE = /*html*/ `
<style>
.container .row3, .row1 p {
  flex-grow: 1;
  padding: 10px 15px;
  margin: 0;
  text-align: left;
  font-size: 1.2em;
  word-break:break-all;
}
.container .row3 p:empty::before {
  content: "No comment were left";
  color: var(--color-gray);
  font-style: italic;
}
.container .row2 .question p{
  font-weight: 700;
}
.container .row1 p{
  font-size: var(--font-size-base);
  font-weight: 700;
  max-width: 50%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.container[hidden] {
  display: none;
}
.container .row1 p[value="0"] {
  visibility: hidden;
}
.container .row1 p span[value="0"] {
  display:none;
}
.container .row1 p .sub-text {
  color: grey;
  margin-left: 5px;
}
.container {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-gray);
  page-break-inside: avoid;
  font-size: var(--font-size-base);
}
.container .row1 {
  display: flex;
}
.container .row2, .row3 {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-top: 1px solid var(--color-gray);
  padding: 10px 15px;
}
.title {
  background-color: var(--color-light-blue);
  color: var(--color-blue);
  font-weight: 700;
  border-right: 1px solid var(--color-gray);
}
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
.rating-icon[value='1'] {
  color: var(--color-yellow);
}
.rating-icon {
  color: var(--color-gray);
  margin-left: 3px;
}
.rating-icon svg {
  position: relative;
  top: 3px;
  margin-left: 1px;
  width: 13pt;
  height: 13pt;
}
.rating-text {
  font-weight: 700;
}
.rating-icon:first-child {
  margin-left: 15px;
}
.break {
  flex-basis: 100%;
}
.no-margin {
  margin: 0 !important;
}
</style>

<div class="page">
  <div class="title-card">
    ${COVER_BG}

    <div class="title-contents">
      <h3>{{interview_rating_summary.company_name}}</h3>
      <span class="job-title">{{interview_rating_summary.job_title}}</span>
      <h1 class="name">{{interview_rating_summary.first_name}} {{interview_rating_summary.last_name}}</h1>
    </div>
  </div>

  <div class="spacer-md">
    <div class="spacer-xs">
      <h1>{{interviewCoverPage.overallScore}}</h1>
      <div class="container">
          <div class="row1">
              <p class="title">
                {{interviewCoverPage.ratings}}
                <span class="sub-text no-margin break">({{replaceValue interview_rating_summary.interview_response.length interviewCoverPage.ratingBased}})</span>
              </p>
              <p class="rating-text">
                <span>
                  {{interview_rating_summary.interview_average_rating}}
                  {{#loopIcon interview_rating_summary.interview_average_rating}}
                    <span class="rating-icon" value="">${ICON_STAR}</span>
                  {{/loopIcon}}
                </span>
              </p>
          </div>
      </div>
    </div>
    <div class="spacer-xs">
      <h1>{{interviewCoverPage.allRatingAndReviews}}</h1>
      {{#if interview_rating_summary.interview_response}}
        {{#each interview_rating_summary.interview_response}}
          <div class="container">
            <div class="row1">
                <p class="title">{{this.respondent_name}}
                  <span class="sub-text ">{{dateToLocaleString this.submitted_at ../language ../timezone}}</span>
                </p>
                <p class="rating-text">
                {{answerValue this.score ../interviewRatingText}}
                  <span>
                    {{#loopIcon this.score}}
                      <span class="rating-icon" value="">${ICON_STAR}</span>
                    {{/loopIcon}}
                  </span>
                </p>
            </div>
            <div class="row3">
              <p>{{this.note}}</p>
            </div>
          </div>
        {{/each}}
      {{/if}}
    </div>
  </div>
</div>
`;

export const INTERVIEW_REPORT_TEMPLATE = /*html*/ `
<style>
.dimension {
  margin-left: 5pt;
}
.sub-title {
  text-transform: capitalize;
  page-break-before: always;
}
.sub-title:first-child{
  page-break-before: avoid;
}
.end-text {
  text-align: center;
  margin-top: 10pt;
}
.question p[value="interview_template"] {
  display: none;
}
</style>
<div class="page">
  <div class="spacer-md">
    {{#each interview_rating_summary.interview_response}}
      <h1 class="sub-title uppercase">{{replaceValue this.respondent_name ../interviewResponsePage.interviewResponseBy}}</h1>
      <h1>Date: {{dateToLocaleString this.submitted_at ../language ../timezone}}</h1>
      <div>
        {{#eachWithSortObject this.questions}}
          <h1 class="sub-title">{{transformQuestionType this.key}}</h1>
          {{#each this.value}}
            <div class="container" {{ifOneEmptyThenHide this.note this.score this.answers.value this.question_type}}>
                <div class="row1">
                    <p class="title">{{this.question_title}}
                      {{#ifNotEquals this.question_type 'interview_template'}}
                        {{#dimensionLevel this.dimension_level}}
                          <span class="">{{this}}</span>
                        {{/dimensionLevel}}
                      {{/ifNotEquals}}
                    </p>
                    {{#isAnd this.answers.value this.score}}
                      <p class="rating-text">
                      {{answerValue this.answers.value ../../../interviewRatingText}}
                      <span>
                        {{#loopIcon this.answers.value}}
                          <span class="rating-icon" value="">${ICON_STAR}</span>
                        {{/loopIcon}}
                      </span>
                      </p>
                    {{/isAnd}}
                </div>
                <div class="row2">
                  <div class="question">
                      {{#each this.question_content}}
                      <p value="{{../this.question_type}}">Question</p>
                        <p>{{this.question}}</p>
                          <ul>
                            {{#each this.additionals}}
                              <li>{{this}}</li>
                            {{/each}}
                          </ul>
                      {{/each}}
                  </div>
                </div>
                <div class="row3">
                  <p>{{this.note}}</p>
                </div>
            </div>
          {{/each}}
        {{/eachWithSortObject}}
        </div>
      </div>
    {{/each}}
      <h1 class="end-text">{{interviewResponsePage.endOfReport}}</h1>
  </div>
</div>
`;

export const INTERVIEW_REPORT_BODY_TEMPLATE = /*html*/ `
<main>
<div>
  <!-- Cover Page -->
  ${INTERVIEW_COVER_PAGE_TEMPLATE}

  <!-- Page 1: Interview Result Summary -->
  ${INTERVIEW_REPORT_TEMPLATE}

</div>
</main>
`;

export const INTERVIEW_REPORT_FOOTER_TEMPLATE = `
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
              {{interview_rating_summary.first_name}} {{interview_rating_summary.last_name}} - {{interview_rating_summary.job_title}},
              {{interview_rating_summary.company_name}}
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

export const INTERVIEW_RESPONSE_HTML_TEMPLATE = /*html*/ `
<!DOCTYPE html>
<html lang="en">
${INTERVIEW_REPORT_HEAD_TEMPLATE}
<body>
  ${INTERVIEW_REPORT_BODY_TEMPLATE}
  ${SCRIPT_TEMPLATE}
</body>
</html>
`;
