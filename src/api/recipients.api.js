// FIXME Write the real api functions
const recipientTemplate = (index) => ({
  title: `Recipient ${index}`,
  deployments: [],
  country: '',
  region: '',
  district: '',
  community: '',
  groupName: '',
  language: [],
  listeningModels: [],
  numberTalkingBooks: '',
  agent: '',
  agentGender: '',
  supportEntity: '',
  directBeneficiaries: '',
  directBeneficiariesAdditionalFields: {},
  indirectBeneficiaries: ''
})

const getRecipients = () => [recipientTemplate(1), recipientTemplate(2), recipientTemplate(2)]

const postRecipients = (data) => recipientTemplate(data.total + 1)

const putRecipients = () => true


export {
  getRecipients,
  postRecipients,
  putRecipients
}
