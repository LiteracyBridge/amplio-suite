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
  numberTalkingBooks: index,
  agent: 'Some more long text',
  agentGender: '',
  supportEntity: '',
  directBeneficiaries: '',
  directBeneficiariesAdditionalFields: {},
  indirectBeneficiaries: ''
})

const getRecipients = async (programCode, from=0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = Array(10).fill().map((_, i) => recipientTemplate(from + i))
      resolve(response)
    }, 2000)
  })
}

const postRecipients = (data) => recipientTemplate(data.total + 1)

const putRecipients = () => true


export {
  getRecipients,
  postRecipients,
  putRecipients
}
