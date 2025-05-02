export default {
  modalLanguageSelect: {
    select: 'Select Language:',
    en: 'English',
    ms: 'Bahasa Malaysia',
    zh: '简体中文',
  },

  Header: {
    Label: {
      reload: 'Payment',
      topupStatus: 'Reload Status',
      customAmount: 'Received Amount',
      changePin: 'Change PIN',
      forgetPin: 'Forget PIN',
      login: 'Login',
      privacyPolicy: 'Privacy Policy',
      termAndCondition: 'Terms & Conditions',
      transfer: 'Transfer',
      moneyTransfer: 'Transfer Money',
      referral: 'Referral Rewards',
      privacyPolicy: 'Privacy Policy',
      contactUs: 'Contact Us',
      aboutUs: 'About Us',
      editProfile: 'Edit Profile',
      bankCard: 'My Bank Card(s)',
      bankCardAdded: 'Add Card',
      changeMobileNo: 'Change Mobile No.',
      transactionHistory: 'Transaction History',
      transactionDetails: 'Transaction Details',
    },
  },

  Account: {
    editProfile: 'Edit Profile',
    myPoints: 'My Points',
    myBankCard: 'My Bank Card(s)',
    changeMobileNo: 'Change Mobile No.',
    change6DigitPin: 'Change 6-digit PIN',
    referralRewards: 'Referral Rewards',
    helpCenter: 'Help Center',
    privacyPolicy: 'Privacy Policy',
    termsAndConditions: 'Terms & Conditions',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    language: 'Language',
    logout: 'Log Out',
    user: 'User',
    loading: 'Loading...',
    enableBiometrics: 'Enable Biometrics',
    biometricsDescription: 'Log in and make payments by scanning your finger',

    ChangeMobileNumber: {
      mobileModifySuccess: 'Mobile No. Modified Successful!',
      mobileNoExist: 'Mobile No Already Exist!',
      verifyMobile: 'Verify Mobile Number',
      verifyDescription:
        'Verification code has been sent by SMS to new number for change permission',
      existNumber: 'Exist Number',
      newNumber: 'New Number',
      submitOTP: 'Submit OTP',
      sendOTP: 'Send OTP',
      loading: 'Loading...',

      newNumberRequired: 'New Number is required',
    },

    ChangePin: {
      invalidPin: 'Pin Invalid, Please try again.',
      change6DigitPin: 'Change 6-digit PIN',
      change6DigitPinDescription:
        'To verify your identity, first enter your current 6-digit PIN.',
      forgetPin: 'Forget your PIN ?',
      submit: 'Submit',
    },

    SetOldNewPin: {
      changeNewPinSuccess: 'Change New Pin Successful!',
      pinNotMatch: 'PIN Not Match',
      enterNew6DigitPin: 'Enter new 6-digit PIN',
      enterNew6DigitPinDescription:
        'This 6-digit PIN will be asked when you perform a transaction.',
      newPin: 'New Pin',
      confirmPin: 'Confirm your PIN',
      submit: 'Submit',
      loading: 'Loading...',
    },

    ReferralRewards: {
      referCodeCopy: 'Refer Code copied !',
      referGetRM20: 'Refer to get RM20',
      referCodeDescription:
        'Share your referral code to get\nRM20 once your friends activate their\ncard, and they will get RM20 too!',
      invitationCode: 'Invitation Code',
      shareLink: 'Share link to invite friends',
      yourReferral: 'Your referrals',
      usedmyCode: 'Used my code',
      activeCards: 'Activated their cards',
      referTnC: 'Referral Terms & Conditions',
      loading: 'Loading...',
    },

    ContactUs: {
      messageSendSuccessful: 'Message Send Successful!',
      message: 'Message',
      sendMessage: 'Send Message',
      messageDescription:
        'Tell us more about your project, needs, and timeline...',
      loading: 'Loading...',

      messageRequired: 'Message is required',
    },

    Home: {
      scan: 'Scan',
      pay: 'Pay',
      receive: 'Receive',
      transfer: 'Transfer',
      balance: 'Balance',
      reload: 'Reload',
      normalWallet: 'Normal Wallet',
      points: 'Points',
      transactionHistory: 'Transaction History',
      viewMore: 'View More >',
      noTransaction: "There's no transaction yet...",
      highlight: 'Highlights',
      loading: 'Loading...',

      EnterAmount: {
        receiverQr: 'Receiver QR',
        receiverQrDescription:
          'Show your QR code to your friends or family to receive payment.',
        loading: 'Loading...',
      },

      Receive: {
        invalidQr: 'Invalid QR Code',
        scan: 'Scan',
        pay: 'Pay',
        receive: 'Receive',
        receiverQr: 'Receiver QR',
        receiverQrDescription:
          'Show your QR code to your friends or family to receive payment.',
        enterAmount: 'Enter Amount',
        shareQr: 'Share QR Code',
        amount: 'Amount',
        submitAmount: 'Submit Amount',
        showToCasherMakePayment: 'Show this to the cashier to make payment.',
        second: 'SEC',
        scanAndClick: 'SCAN AND CLICK HERE',
        scanbyCasher: 'Scan by Cashier',
        placeBarcode: 'Place a barcode inside the scan area',
        loading: 'Loading...',

        amountRequired: 'Amount is required',
      },
    },
  },

  LoginPage: {
    Label: {
      login: 'Login',
      signUp: 'Sign Up',
      mobileNumber: 'Mobile Number',
      loading: 'Loading...',
      resendOtp: 'Try to resend new OTP',
      yourMobile: 'Your Mobile Number',
      requestOtpAgain: 'Please request again if you do not receive OTP',
      referralCode: 'Have referral code?',
      referralPlaceholder: 'Insert your invitation code here',
      loading: 'Loading...',
      resendOtp: 'Resend OTP',
    },
    button: {
      resendOtp: 'Resend OTP',
      login: 'Log In',
      signUp: 'Sign Up',
    },
    ErrorMessage: {
      mobileNumberRequired: 'Please enter mobile number',
      mobileNumberInvalid: 'Please insert valid mobile number',
    },
  },

  SignUp: {
    Label: {
      mobileNumberExist: 'Mobile number exist',
      whatMobileNumber: "What's Your Mobile Number?",
      verify6Digit: 'Simplicity will send you a 6-digit verification code',
      mobileNumber: 'Mobile Number',
      sendCode: 'Send Code',
      loading: 'Loading...',
    },

    ErrorMessage: {
      tryAnotherNumber: 'Please try another mobile number',
      mobileNumberRequired: 'Please enter mobile number',
      mobileNumberInvalid: 'Please insert valid mobile number',
    },
  },

  OtpSignUp: {
    Label: {
      success: 'Success',
      signUpSuccess: 'Sign Up Success !',
      backToLogin: 'Back to Login',
      mobileNumber: 'Mobile Number',
      requestOTP: 'Request OTP',
      resendOTP: 'Resend OTP in',
      signUp: 'Sign Up',
      loading: 'Loading...',
      verifyPhoneNo: 'Verify Phone Number',
      description:
        "Please enter valid mobile number \nand we'll need to send you an OTP \nto finish setting up your account",
    },

    ErrorMessage: {
      mobileNumberInvalid: 'Please enter valid contact number',
      mobileNumberExisted: 'Contact number existed',
      mobileNumberRequired: 'Please enter your mobile number',
    },
  },

  transactionHistory: {
    Label: {
      noTransaction: "There's no transaction yet...",
      dateRange: 'Date Range :',
    },
  },

  transactionDetails: {
    Label: {
      transactionType: 'Transaction Type',
      user: 'User',
      dateTime: 'Date/Time',
      txnId: 'Transaction ID',
      normalWallet: 'Normal Wallet',
      specialWallet: 'Special Wallet',
      walletName: 'Wallet Name',
      description: 'Description',
    },
  },

  AccountVerificationStatus: {
    verifingDetails: "Thanks, we're verifing your details.",
    fewWorkingDays:
      'It usually takes a few minutes but it may take up to 2 working days.',
    loginNow: 'Login Now',
  },

  CheckAccountVerificationStatus: {
    workingOnIt: 'Still working on it!',
    revertSoon: "We'll revert soon!",
    checkLater: 'Check back at later stage.',
    weCouldNot: 'We could not',
    verifyIdentity: 'verify your identity',
    signUpNow: 'Sign Up Now',
    finalStep: 'Final Step :',
    addRM10: 'Add RM10.00',
    topUpDescription:
      'So, we can send your Simplicity Wallet to you. Don’t worry, it’s not a fee. You’ll be able to spend the RM10.00 as soon as it available.',
    topUpLater: 'Top Up Later',
  },

  DeviceInformation: {
    Label: {
      appVersion: 'App Version',
      coreVersion: 'Core Version',
      systemVersion: 'System Version',
      deviceModel: 'Device Model',
      networkOperator: 'Network Operator',
    },
  },

  topUp: {
    Label: {
      redirect: 'Redirecting to payment webview for payment processing',
      selectPaymentMethod: 'Select Payment Method',
      loading: 'Loading...',
    },

    ErrorMessage: {
      minAmount: 'Min. RM10 is required',
    },
  },

  IdentityUpload: {
    error: 'Error',
    continue: 'Continue',
    takeNewPicture: 'Take a new picture',
    allowCameraAccess: 'Allow camera access',
    cameraAccessDescription:
      "Enable your camera to take picture with your mobile.\n\nIf you deny camera access, you won't be able to take picture and complete the verification process.",
    allow: 'Allow',
    deny: 'Deny',
    frontPassport: 'Front of Passport',
    frontPassportDescription:
      'Position the front of your passport in the frame',
    passportReadable: 'My passport is readable',
    frontIC: 'Front of Identity Card',
    backIC: 'Back of Identity Card',
    IcDescription: 'Position the front of your card in the frame',
    cardReadable: 'My card is readable',
    failedTakePicture: 'Failed to take picture: ',
  },

  SignUpBiometric: {
    Label: {
      allow: 'Allow ',
      loginFasterDesc: 'Log in faster and secure your account with your ',
    },
    button: {
      scanNow: 'Scan Now',
      noThanks: 'No thanks',
    },
  },

  biometricPlugin: {
    Label: {
      faceId: 'Face ID',
      touchId: 'Touch ID',
      biometric: 'Biometrics',
    },
    Description: {
      faceTouchId: 'Scan your fingerprint on the device scanner to continue',
      biometricTransfer: 'Verify with Biometrics',
      biometricLogin: 'Login with Biometrics',
    },
    successMessage: {
      enabled: 'Enabled!',
    },
    errorMessage: {
      notSupport: 'Biometric not supported',
      enrollFail: 'Failed to enroll',
    },
  },

  SignUpDetails: {
    Label: {
      introduce: 'Please introduce yourself',
      fullName: 'Full Name',
      email: 'Email Address',
      dob: 'Date of Birth',
      gender: 'Gender',
      nationality: 'Nationality',
      idType: 'ID Type',
      nric: 'NRIC / Passport No.',
      occupation: 'Occupation',
      industry: 'Industry',
      homeAddress: "What's your home address?",
      addressLine1: 'Line 1',
      addressLine2: 'Line 2',
      state: 'State',
      city: 'City',
      country: 'Country',
      selectDob: 'Select Date of Birth',
      loading: 'Loading...',
    },
    placeHolder: {
      fullName: 'As per NRIC or Passport',
      email: 'Your email address',
      pickerSelect: 'Select',
      addressLine1: 'Address Line 1',
      addressLine2: 'Address Line 2',
      country: 'Country',
    },
    button: {
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
    },
    errorMessage: {
      fullName: 'Full name is required',
      email: 'Email is required',
      emailPattern: 'Invalid email address',
      emailExist: 'Email already exist',
      dob: 'Please select your date of birth',
      gender: 'Please select your gender',
      nationality: 'Please select your nationality',
      idType: 'Please select ID type',
      nric: 'NRIC / Passport No. is required',
      nricExist: 'NRIC / Passport already exist',
      occupation: 'Please select your occupation',
      industry: 'Please select industry',
      address1: 'Please insert Address Line 1',
      state: 'Please select state',
      city: 'Please select city',
      country: 'Please select country',
    },
  },

  SecureCode: {
    Label: {
      createPin: 'Create 6-digit PIN',
      enterPin: 'Enter new 6-digit PIN',
      setPinDesc:
        'This 6-digit PIN will be asked when you perform a transaction',
      setPin: 'Set your PIN',
      confirmPin: 'Confirm your PIN',
      resetPin: 'Reset Your PIN',
      resetPinDesc:
        'To verify your identity, please request an OTP and an SMS will be sent to your registered mobile number',
      mobileNumber: 'Mobile Number',
      keyNewPin: 'Key in your new PIN.',
      loading: 'Loading...',
    },
    button: {
      submit: 'Submit',
      ok: 'OK',
      sendOtp: 'Send OTP',
    },
    successMessage: {
      resetPinSuccess: 'Reset New Pin Successful',
    },
    errorMessage: {
      pinNotMatch: 'PIN Not Match',
    },
  },

  IdentityVerification: {
    takeNricPassportPicture: 'Take a picture of your NRIC or Passport',
    verifyDescription:
      'This will be used for verification purpose and will not be shared externally.',
    scanDocumentDescription:
      'Photos of scanned documents will not be approved.',
    nric: 'NRIC',
    passport: 'Passport',
  },

  PaymentStatus: {
    Label: {
      transferred: 'Transferred',
      receiver: 'Receiver',
      walletType: 'Wallet Type',
      walletName: 'Wallet Name',
      txnNo: 'Transaction No.',
      remark: 'Remark',
      dateTime: 'Date & Time',
      verifyPin: 'Verify PIN',
      amount: 'Amount',
      writeRemark: 'Write your remark here',
      loading: 'Loading...',
      transferring: 'Transferring...',
      mobileNumber: 'Mobile Number',
      recent: 'Recent',
      noRecentTransferDesc:
        "Oops... There's no any recent transfer yet. Make a transfer now.",
    },
    button: {
      done: 'Done',
      submit: 'Submit PIN',
      confirmTransfer: 'Confirm Transfer',
      ok: 'OK',
      next: 'Next',
    },
    errorMessage: {
      amount: 'Amount is required',
      remark: 'Remark is required',
      pinNotMatch: 'PIN is not match',
    },
    notification: {
      transferSuccess: 'Transfer Successful',
      transferDesc: ' was deducted from your wallet on ',
    },
  },

  OnboardingPage: {
    Label: {
      page1Title: 'A new way of banking',
      page1Desc: 'Simplify your finance',
      page2Title: 'Reach your financial goals',
      page2Desc: 'UCSI e-Wallet is free to get and free to keep',
      page3Title: 'Enjoy cashless payments',
      page3Desc: 'In-store and online worldwide',
    },
    button: {
      signUp: 'SignUp',
      login: 'Log In',
    },
  },

  IdentityVideo: {
    Label: {
      recordSelfie: 'Record a selfie video',
      recordSelfie2: "Let's make sure no one is impersonating you.",
      record15second: 'Record selfie for 15 seconds',
      turnRight: '1. Turn head to the right',
      turnLeft: '1. Turn head to the left',
      start: 'Start',
      stop: 'Stop',
      uploading: 'Uploading...',
    },
    button: {
      continue: 'Continue',
      allow: 'Allow',
      deny: 'Deny',
    },
    errorMessage: {
      error: 'Error',
      recordFail: 'Failed to record video: ',
    },
    permissions: {
      allowMicTitle: 'Allow microphone access',
      allowMicDesc:
        "Enable your microphone to take a video.\n\nIf you deny microphone access, you won't be able to take a video and complete the verification process.",
    },
  },
};
