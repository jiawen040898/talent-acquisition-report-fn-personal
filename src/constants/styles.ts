export const STYLE_TEMPLATE = /*html*/ `
<style>
  @media print {
    @page {
      size: A4;
    }
    .page {
      break-before: page;
    }
    .one-piece {
      break-inside: avoid;
    }
  }
  :root {
    --page-width: 595pt;
    --page-height: calc(var(--page-width) * 1.41);
    --page-margin: 72px;
    --page-margin-block-end: 120px;
    --color-primary: #262626;
    --color-secondary: #646464;
    --color-tag-required: #C4C4C4;
    --color-score-high: #73D13DFF;
    --color-score-average: #F7B800FF;
    --color-score-low: #F2466EFF;
    --color-blue: #0090ff;
    --color-light-blue: #E6F7FF;
    --color-green: #52c41a;
    --color-yellow: #fa8c16;
    --color-red: #f5222d;
    --color-light-gray: rgba(0, 0, 0, 0.45);
    --color-gray: rgba(0, 0, 0, 0.15);
    --color-gray-light: rgba(0, 0, 0, 0.02);
    --font-size-base: 9pt;
    --font-size-bigger: 13pt;
    --font-size-smaller: 7pt;
    --size-xss: 4pt;
    --size-xs: calc(var(--size-xss) * 2);
    --size-sm: calc(var(--size-xss) * 3);
    --size-md: calc(var(--size-xss) * 4);
    --size-lg: calc(var(--size-xss) * 6);
    --size-svg: 11pt;
  }
  * {
    box-sizing: border-box;
    margin: 0;
  }
  html,
  body {
    font-family: 'Fira Sans', sans-serif;
    color: var(--color-secondary);
    font-size: var(--font-size-base);
    line-height: 1.5;
    margin: 0;
  }
  .page {
    width: calc(var(--page-width) - var(--page-margin) - var(--page-margin));
  }
  .relative {
    position: relative;
  }
  h1,
  h2,
  h3,
  p, pre {
    font-size: var(--font-size-base);
    margin: 0;
  }
  pre {
    font-family: inherit;
    white-space: pre-wrap;
  }
  h1 {
    color: var(--color-blue);
  }
  h2 {
    color: var(--color-primary);
    font-weight: 600;
  }
  h3 {
    color: var(--color-primary);
    font-size: var(--font-size-bigger);
  }
  p, pre {
    margin-block-start: var(--size-xss);
  }
  ol,
  ul {
    padding-inline-start: var(--size-md);
  }
  ol li,
  ul li {
    margin-block-start: var(--size-xss);
  }
  .uppercase {
    text-transform: uppercase !important;
  }
  .spacer-xss {
    margin-block-start: var(--size-xss) !important;
  }
  .spacer-xs {
    margin-block-start: var(--size-xs) !important;
  }
  .spacer-sm {
    margin-block-start: var(--size-sm) !important;
  }
  .spacer-md {
    margin-block-start: var(--size-md) !important;
  }
  .spacer-lg {
    margin-block-start: var(--size-lg) !important;
  }
  .indent-md {
    margin-inline-start: var(--size-md) !important;
  }
  .row {
    display: flex;
    gap: var(--size-xs);
    width: 100%;
  }
  .icon-value-pair {
    padding-inline-start: var(--size-md);
    position: relative;
  }
  .icon-value-pair .icon {
    height: var(--size-svg);
    left: 0;
    inset-inline-start: 0;
    position: absolute;
    width: var(--size-svg);
  }
  .icon.lighter {
    opacity: 50%;
  }
  .icon-value-pair .value {
    align-items: center;
    display: flex;
    gap: var(--size-xss);
  }
  .icon-list {
    align-items: center;
    display: flex;
    gap: 2pt;
  }
  .icon-list svg {
    height: var(--size-svg);
  }
  .score {
    color: var(--color-yellow);
  }
  .score.high {
    color: var(--color-green);
  }
  .score.low {
    color: var(--color-red);
  }
  .progress-bar {
    margin-block-start: 2pt;
  }
  .progress-bar .bar {
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 2pt;
    height: 13pt;
    flex: 1;
    position: relative;
    width: 220pt;
  }
  .progress-bar .bar.full-width {
    flex: 1;
    width: unset;
  }
  .progress-bar .fill {
    background: linear-gradient(270deg, rgba(0, 144, 255, 0.85) 13.05%, rgba(135, 94, 255, 0.85) 94.44%);
    border-radius: 2pt;
    display: block;
    content: "";
    inset-block-end: 0;
    inset-block-start: 0;
    inset-inline-start: 0;
    position: absolute;
    height: 13pt;
  }
  .progress-bar .fill-high {
    background: rgb(115, 209, 61);
    border-radius: 2pt;
    display: block;
    content: "";
    inset-block-end: 0;
    inset-block-start: 0;
    inset-inline-start: 0;
    position: absolute;
    height: 13pt;
  }
  .progress-bar .fill-average {
    background: rgb(247, 184, 0);
    border-radius: 2pt;
    display: block;
    content: "";
    inset-block-end: 0;
    inset-block-start: 0;
    inset-inline-start: 0;
    position: absolute;
    height: 13pt;
  }
  .progress-bar .fill-low {
    background: rgb(242, 70, 110);
    border-radius: 2pt;
    display: block;
    content: "";
    inset-block-end: 0;
    inset-block-start: 0;
    inset-inline-start: 0;
    position: absolute;
    height: 13pt;
  }
  .tag-container {
    display: flex;
    flex-wrap: wrap;
  }
  .tag,
  .dimension {
    background-color: var(--color-gray-light);
    border: 1px solid var(--color-gray);
    border-radius: 2pt;
    display: inline-block;
    font-weight: 400;
    padding: 0 6pt;
    text-transform: capitalize;
    margin-right: 4pt;
    margin-bottom: 4pt;
  }
  .tag.blue {
    background-color: #e6f7ff;
    border-color: #91d5ff;
    color: var(--color-blue);
  }
  .chart-container {
    border: 1px solid var(--color-gray);
    border-radius: 2pt;
    height: 200pt;
    margin: var(--size-md) 0;
    padding: var(--size-xss);
  }
  .chart-container > div {
    height: 100%;
    width: 100%;
  }
  .with-dimension {
    align-items: baseline;
    display: flex;
  }
  .dimension {
    margin-right: 0pt;
    margin-left: 4pt;
    margin-bottom: 4pt;
  }
  .dimension.high {
    background-color: #f6ffed;
    border-color: var(--color-green);
    color: var(--color-green);
  }
  .dimension.average {
    background-color: #fff7e6;
    border-color: var(--color-yellow);
    color: var(--color-yellow);
  }
  .dimension.low {
    background-color: #fff1f0;
    border-color: var(--color-red);
    color: var(--color-red);
  }
  .heat-tag-10 {
    color: #fff;
    border: 1px solid #083163;
    background: #083163;
}
.heat-tag-9 {
    color: #fff;
    border: 1px solid #0c498a;
    background: #0c498a;
}

.heat-tag-8 {
    color: #fff;
    border: 1px solid #1967b0;
    background: #1967b0;
}

.heat-tag-7 {
    color: #fff;
    border: 1px solid #2988d6;
    background: #2988d6;
}

.heat-tag-6 {
    color: #fff;
    border: 1px solid #3cacfc;
    background: #3cacfc;
}

.heat-tag-5 {
    color: #fff;
    border: 1px solid #66c4ff;
    background: #66c4ff;
}

.heat-tag-4 {
    color: #fff;
    border: 1px solid #8fd8ff;
    background: #8fd8ff;
}

.heat-tag-3 {
    color: #3cacfc;
    border: 1px solid #b8e8ff;
    background: #b8e8ff;
}

.heat-tag-2 {
    color: #3cacfc;
    border: 1px solid #b8e8ff;
    background: #e0f6ff;
}

.heat-tag-1 {
    color: #3cacfc;
    border: 1px solid #b8e8ff;
    background: #f0fbff;
}
</style>
`;
