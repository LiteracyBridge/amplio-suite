module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue'
  ],
  theme: {
    extend: {
      boxShadow: {
        navbar: '0 1px 2px 0 rgba(60,64,67,0.3),0 2px 6px 2px rgba(60,64,67,0.15)',
        box: '0 1px 2px 0 rgba(60,64,67,.3),0 2px 6px 2px rgba(60,64,67,.15)',
        hover: '0 8px 24px 0px rgba(0,0,0,0.5)'
      },
      colors: {
        green: '#289b6a',
        blue: '#475caa'
      },
      minHeight: {
        '3/4': '75vh',
        '200-px': '200px'
      },
      inset: {
        41: '41%'
      },
      spacing: {
        96: '24rem'
      }
    }
  }
}
