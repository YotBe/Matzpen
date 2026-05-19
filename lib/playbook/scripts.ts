// De-escalation playbook based on the LEAP method (Listen, Empathize,
// Agree, Partner) developed by Xavier Amador for engaging people with
// anosognosia / severe mental illness who refuse treatment.
//
// Each scenario gives Hebrew phrases the caregiver can actually say —
// not theory. The principle throughout: validate the feeling without
// agreeing with the delusion. Saying "you must be terrified" is honest;
// saying "yes, the neighbors really are listening" is collusion.

export type Scenario =
  | 'paranoid_delusions'
  | 'grandiosity'
  | 'agitation'
  | 'refusal_meds'
  | 'suicidal_ideation'
  | 'withdrawal';

export interface PlaybookCard {
  scenario: Scenario;
  // Pulled from translations: title, sign(s), do, don't, sample script.
  titleKey: string;
  signsKey: string;
  doKey: string;
  dontKey: string;
  scriptKey: string;
  scriptAltKey?: string;
}

export const PLAYBOOK: PlaybookCard[] = [
  {
    scenario: 'paranoid_delusions',
    titleKey: 'playbook.paranoid.title',
    signsKey: 'playbook.paranoid.signs',
    doKey: 'playbook.paranoid.do',
    dontKey: 'playbook.paranoid.dont',
    scriptKey: 'playbook.paranoid.script',
    scriptAltKey: 'playbook.paranoid.scriptAlt',
  },
  {
    scenario: 'grandiosity',
    titleKey: 'playbook.grandiosity.title',
    signsKey: 'playbook.grandiosity.signs',
    doKey: 'playbook.grandiosity.do',
    dontKey: 'playbook.grandiosity.dont',
    scriptKey: 'playbook.grandiosity.script',
    scriptAltKey: 'playbook.grandiosity.scriptAlt',
  },
  {
    scenario: 'agitation',
    titleKey: 'playbook.agitation.title',
    signsKey: 'playbook.agitation.signs',
    doKey: 'playbook.agitation.do',
    dontKey: 'playbook.agitation.dont',
    scriptKey: 'playbook.agitation.script',
  },
  {
    scenario: 'refusal_meds',
    titleKey: 'playbook.refusalMeds.title',
    signsKey: 'playbook.refusalMeds.signs',
    doKey: 'playbook.refusalMeds.do',
    dontKey: 'playbook.refusalMeds.dont',
    scriptKey: 'playbook.refusalMeds.script',
    scriptAltKey: 'playbook.refusalMeds.scriptAlt',
  },
  {
    scenario: 'suicidal_ideation',
    titleKey: 'playbook.suicidal.title',
    signsKey: 'playbook.suicidal.signs',
    doKey: 'playbook.suicidal.do',
    dontKey: 'playbook.suicidal.dont',
    scriptKey: 'playbook.suicidal.script',
  },
  {
    scenario: 'withdrawal',
    titleKey: 'playbook.withdrawal.title',
    signsKey: 'playbook.withdrawal.signs',
    doKey: 'playbook.withdrawal.do',
    dontKey: 'playbook.withdrawal.dont',
    scriptKey: 'playbook.withdrawal.script',
  },
];
