// FIXME Write the real api functions
const recipientTemplate = (index) => ({
  title: `Recipient ${index}`,
  deployments: [],
  country: '',
  region: 'Turkana',
  district: 'South',
  community: 'Lokapel',
  groupName: 'Naro',
  language: 'Turkana (tuv)',
  listeningModels: [],
  numberTalkingBooks: 10,
  agent: 'Some more long text',
  agentGender: '',
  supportEntity: '',
  directBeneficiaries: '',
  directBeneficiariesAdditionalFields: {},
  indirectBeneficiaries: ''
})

const getRecipients = () => [recipientTemplate(1), recipientTemplate(2), recipientTemplate(3)]

const postRecipients = (data) => recipientTemplate(data.total + 1)

const putRecipients = () => true


export {
  getRecipients,
  postRecipients,
  putRecipients
}
