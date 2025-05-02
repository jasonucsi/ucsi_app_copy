export default {
  modalLanguageSelect: {
    select: '选择语言 :',
    en: 'English',
    ms: 'Bahasa Malaysia',
    zh: '简体中文',
  },

  Header: {
    Label: {
      reload: '支付网络视图',
      topupStatus: '重新加载状态',
      customAmount: '收到金额',
      changePin: '更改密码',
      forgetPin: '忘记密码',
      login: '登录',
      privacyPolicy: '隐私政策',
      termAndCondition: '条款和条件',
      transfer: '转帐',
      moneyTransfer: '转帐银额',
      referral: '推荐奖励',
      privacyPolicy: '隐私政策',
      contactUs: '联系我们',
      aboutUs: '关于我们',
      editProfile: '更改个人资料',
      bankCard: '我的银行卡',
      creditDebitCard: '信用卡/借记卡',
      changeMobileNo: '更改手机号码.',
      transactionHistory: '交易记录',
      transactionDetails: '交易明细',
    },
  },

  Account: {
    editProfile: '更改个人资料',
    myPoints: '我的积分',
    myBankCard: '我的银行卡',
    changeMobileNo: '更改手机号码.',
    change6DigitPin: '更改6位 PIN 密码',
    referralRewards: '推荐奖励',
    helpCenter: '帮助中心',
    privacyPolicy: '隐私政策',
    termsAndConditions: '条款和条件',
    aboutUs: '关于我们',
    contactUs: '联系我们',
    language: '语言',
    logout: '登出',
    user: '用户',
    loading: '加载中...',
    enableBiometrics: '启用生物识别',
    biometricsDescription: '登录并付款通过扫描您的手指',

    ChangeMobileNumber: {
      mobileModifySuccess: '手机号码.修改成功!',
      mobileNoExist: '手机已经存在!',
      verifyMobile: '验证手机号码',
      verifyDescription: '验证码已发送通过短信到现有号码关于更改新号码',
      existNumber: '现有号码',
      newNumber: '新号码',
      submitOTP: '提交一次性密码',
      sendOTP: '发送一次性密码',
      loading: '加载中...',

      newNumberRequired: '需要新号码',
    },

    ChangePin: {
      invalidPin: '密码无效, 请再试一次.',
      change6DigitPin: '更改6位 PIN 密码',
      change6DigitPinDescription: '验证您的身份, 首先输入您当前的6位 PIN 密码.',
      forgetPin: '是不是忘记密码?',
      submit: '提交',
    },

    SetOldNewPin: {
      changeNewPinSuccess: '更改新 Pin 密码成功!',
      pinNotMatch: 'PIN 密码不匹配',
      enterNew6DigitPin: '输入新的6位 PIN 密码',
      enterNew6DigitPinDescription: '执行交易时将询问此6位 PIN 密码.',
      newPin: '新 PIN 密码',
      confirmPin: '确认您的 PIN 密码',
      submit: '提交',
      loading: '加载中...',
    },

    ReferralRewards: {
      referCodeCopy: '参考代码已复制 !',
      referGetRM20: '推荐获取 RM20',
      referCodeDescription:
        '分享您的推荐代码以获取\nRM20 一旦你的朋友激活他们的\n户口, 他们也会得到 RM20!',
      invitationCode: '邀请代码',
      shareLink: '分享链接以邀请朋友',
      yourReferral: '您的推荐',
      usedmyCode: '使用我的代码',
      activeCards: '激活他们的卡',
      referTnC: '推荐条款和条件',
      loading: '加载中...',
    },

    ContactUs: {
      messageSendSuccessful: '信息发送成功!',
      message: '信息',
      sendMessage: '发信息',
      messageDescription: '告诉我们更多有关您的项目、需求和时间表的信息...',
      loading: '加载中...',

      messageRequired: '需要留言',
    },

    Home: {
      scan: '扫描',
      pay: '支付',
      receive: '收到',
      transfer: '转帐',
      balance: '结余',
      reload: '重新加载',
      normalWallet: '普通钱包',
      points: '积分',
      transactionHistory: '交易记录',
      viewMore: '查看更多 >',
      noTransaction: '还没有交易...',
      highlight: '强调',
      loading: '加载中...',

      EnterAmount: {
        receiverQr: '接收器二维码',
        receiverQrDescription: '向您的朋友或家人展示您的二维码以接收付款.',
        loading: '加载中...',
      },

      Receive: {
        invalidQr: '无效的二维码',
        scan: '扫描',
        pay: '支付',
        receive: '收到',
        receiverQr: '接收器二维码',
        receiverQrDescription: '向您的朋友或家人展示您的二维码以接收付款.',
        enterAmount: '输入金额',
        shareQr: '分享二维码',
        amount: '金额',
        submitAmount: '提交金额',
        showToCasherMakePayment: '向收银员出示即可付款.',
        second: '秒',
        scanAndClick: '扫描并点击这里',
        scanbyCasher: '收银员扫描',
        placeBarcode: '在扫描区域内放置条码',
        loading: '加载中...',

        amountRequired: '金额为必填项',
      },
    },
  },

  LoginPage: {
    Label: {
      login: '登录',
      signUp: '注册',
      mobileNumber: '手机号码',
      loading: '加载中...',
      resendOtp: '尝试重新发送新的 OTP',
      yourMobile: '您的手机号码',
      requestOtpAgain: '如未收到OTP请重新申请',
      referralCode: '有推荐码?',
      referralPlaceholder: '在此处插入您的邀请码',
      loading: '加载中...',
    },
    button: {
      resendOtp: '重新发送 OTP',
      login: '登录',
      signUp: '注册',
    },
    ErrorMessage: {
      mobileNumberRequired: '请输入手机号码',
      mobileNumberInvalid: '请输入有效的手机号码',
    },
  },

  SignUp: {
    Label: {
      mobileNumberExist: '手机号存在',
      whatMobileNumber: '你手机号码什么号码?',
      verify6Digit: 'Simplicity 将向您发送 6 位验证码',
      mobileNumber: '手机号码',
      sendCode: '发送代码',
      loading: '加载中...',
    },

    ErrorMessage: {
      tryAnotherNumber: '请尝试其他手机号码',
      mobileNumberRequired: '请输入手机号码',
      mobileNumberInvalid: '请输入有效的手机号码',
    },
  },

  OtpSignUp: {
    Label: {
      success: '成功',
      signUpSuccess: '注册成功 !',
      backToLogin: '回到登入',
      mobileNumber: '手机号码',
      requestOTP: '请求一次性密码',
      resendOTP: '重新发送 OTP',
      signUp: '注册',
      loading: '加载中...',
      verifyPhoneNo: '验证电话号码',
      description: '请输入有效的手机号码 \n我们需要向您发送 OTP \n完成帐户设置',
    },

    ErrorMessage: {
      mobileNumberInvalid: '请输入有效的联系电话',
      mobileNumberExisted: '联系电话已存在',
      mobileNumberRequired: '请输入您的手机号码',
    },
  },

  transactionHistory: {
    Label: {
      noTransaction: '还没有交易...',
      dateRange: '日期范围 :',
    },
  },

  transactionDetails: {
    Label: {
      transactionType: '交易类型',
      user: '用户',
      dateTime: '日期/时间',
      txnId: '交易编号',
      normalWallet: '普通钱包',
      specialWallet: '特殊钱包',
      walletName: '钱包名称',
      description: '描述',
    },
  },

  AccountVerificationStatus: {
    verifingDetails: '谢谢, 我们正在验证您的详细信息.',
    fewWorkingDays: '通常需要几分钟，但最多可能需要 2 个工作日.',
    loginNow: '现在登录',
  },

  CheckAccountVerificationStatus: {
    workingOnIt: '还在努力!',
    revertSoon: '我们很快就会回复!',
    checkLater: '稍后再回来查看.',
    weCouldNot: '我们不能',
    verifyIdentity: '验证您的身份',
    signUpNow: '立即注册',
    finalStep: '最后一步 :',
    addRM10: '添加 RM10.00',
    topUpDescription:
      '因此，我们可以将您的 Simplicity 钱包发送给您. 别担心, 这不是费用. 您将能够花费 RM10.00 一旦可用.',
    topUpLater: '稍后充值',
  },

  DeviceInformation: {
    Label: {
      appVersion: '应用版本',
      coreVersion: '核心版',
      systemVersion: '系统版本',
      deviceModel: '设备型号',
      networkOperator: '网络运营商',
    },
  },

  topUp: {
    Label: {
      redirect: '重定向到支付 webview 进行支付处理',
      selectPaymentMethod: '选择付款方式',
      loading: '加载中...',
    },

    ErrorMessage: {
      minAmount: '必须最小RM10',
    },
  },

  IdentityUpload: {
    error: '错误信息',
    continue: '继续',
    takeNewPicture: '拍一张新照片',
    allowCameraAccess: '允许使用相机',
    cameraAccessDescription:
      '使您的相机可以用您的手机拍照.\n\n如果您拒绝相机访问, 您将无法拍照并完成验证过程.',
    allow: '允许',
    deny: '否定',
    frontPassport: '护照正面',
    frontPassportDescription: '将护照正面放在相框中',
    passportReadable: '我的护照是可读的',
    frontIC: '身份证正面',
    backIC: '身份证背面',
    IcDescription: '将卡的正面放在框架中',
    cardReadable: '我的卡是可读的',
    failedTakePicture: '拍照失败: ',
  },

  SignUpBiometric: {
    Label: {
      allow: '允许 ',
      loginFasterDesc: '更快地登录并使用您的帐户保护您的帐户 ',
    },
    button: {
      scanNow: '现在扫描',
      noThanks: '不用了，谢谢',
    },
  },

  biometricPlugin: {
    Label: {
      faceId: '人脸识别',
      touchId: '触控 ID',
      biometric: '生物识别',
    },
    Description: {
      faceTouchId: '在设备扫描仪上扫描您的指纹以继续',
      biometricTransfer: '使用生物识别技术进行验证',
      biometricLogin: '使用生物识别登录',
    },
    successMessage: {
      enabled: '启用!',
    },
    errorMessage: {
      notSupport: '不支持生物识别',
      enrollFail: '报名失败',
    },
  },

  SignUpDetails: {
    Label: {
      introduce: '请自我介绍',
      fullName: '全名',
      email: '电子邮件地址',
      dob: '生日日期',
      gender: '性别',
      nationality: '国籍',
      idType: '身份证类型',
      nric: '身份证/护照.',
      occupation: '职业',
      industry: '行业',
      homeAddress: '你的家庭住址是什么?',
      addressLine1: '1号线',
      addressLine2: '2号线',
      state: '州',
      city: '城市',
      country: '国家',
      selectDob: '选择出生日期',
      loading: '加载中...',
    },
    placeHolder: {
      fullName: '根据身份证或护照',
      email: '您的电子邮件地址',
      pickerSelect: '选择',
      addressLine1: '1号线',
      addressLine2: '2号线',
      country: '国家',
    },
    button: {
      back: '上一页',
      next: '下一页',
      submit: '提交',
    },
    errorMessage: {
      fullName: '需要全名',
      email: '需要电子邮件',
      emailPattern: '无效的邮件地址',
      emailExist: '电子邮件已存在',
      dob: '请选择您的出生日期',
      gender: '请选择您的性别',
      nationality: '请选择您的国籍',
      idType: '请选择身份证类型',
      nric: '需要身份证 / 护照号码',
      nricExist: '身份证/护照已经存在',
      occupation: '请选择您的职业',
      industry: '请选择行业',
      address1: '请填写地址行 1',
      state: '请选择州',
      city: '请选择城市',
      country: '请选择国家',
    },
  },

  SecureCode: {
    Label: {
      createPin: '创建 6 位 PIN 码',
      enterPin: '输入新的 6 位 PIN 码',
      setPinDesc: '执行交易时将询问此 6 位 PIN 码',
      setPin: '设置您的 PIN 码',
      confirmPin: '确认您的 PIN 码',
      resetPin: '重置您的 PIN 码',
      resetPinDesc:
        '为验证您的身份，请申请一次性密码，我们会向您注册的手机号码发送短信',
      mobileNumber: '手机号码',
      keyNewPin: '输入您的新 PIN 码.',
      loading: '加载中...',
    },
    button: {
      submit: '提交',
      ok: '好的',
      sendOtp: '发送OTP',
    },
    successMessage: {
      resetPinSuccess: '重置新 Pin 码成功',
    },
    errorMessage: {
      pinNotMatch: 'PIN 码不匹配',
    },
  },

  IdentityVerification: {
    takeNricPassportPicture: '为您的身份证或护照拍照',
    verifyDescription: '这将用于验证目的，不会对外共享.',
    scanDocumentDescription: '扫描文件的照片将不被批准.',
    nric: '身份证',
    passport: '护照',
  },

  PaymentStatus: {
    Label: {
      transferred: '转帐了',
      receiver: '接收者',
      walletType: '钱包类型',
      walletName: '钱包名称',
      txnNo: '交易编号.',
      remark: '评论',
      dateTime: '日期 & 时间',
      verifyPin: '验证密码',
      amount: '金额',
      writeRemark: '在这里写下您的评论',
      loading: '加载中...',
      transferring: '转帐中...',
      mobileNumber: '手机号码',
      recent: '最近的',
      noRecentTransferDesc: 'Oops... 最近没有任何转帐记录. 立即转账.',
    },
    button: {
      done: '完毕',
      submit: '提交 PIN',
      confirmTransfer: '确认转账',
      ok: '好的',
      next: '下一步',
    },
    errorMessage: {
      amount: '金额为必填项',
      remark: '需要备注',
      pinNotMatch: 'PIN 密码不匹配',
    },
    notification: {
      transferSuccess: '转帐成功',
      transferDesc: ' 已从您的钱包中扣除 ',
    },
  },

  OnboardingPage: {
    Label: {
      page1Title: '一种新的银行方式',
      page1Desc: '简化您的财务',
      page2Title: '实现您的财务目标',
      page2Desc: 'UCSI 电子钱包可免费获取和免费保留',
      page3Title: '享受无现金支付',
      page3Desc: '店内和全球在线',
    },
    button: {
      signUp: '注册',
      login: '登录',
    },
  },

  IdentityVideo: {
    Label: {
      recordSelfie: '录制自拍视频',
      recordSelfie2: '让我们确保没有人冒充您.',
      record15second: '自拍 15 秒',
      turnRight: '1. 头向右转',
      turnLeft: '1. 头向左转',
      start: '开始',
      stop: '停止',
      uploading: '上传中...',
    },
    button: {
      continue: '继续',
      allow: '允许',
      deny: '否定',
    },
    errorMessage: {
      error: '错误信息',
      recordFail: '录制视频失败: ',
    },
    permissions: {
      allowMicTitle: '允许麦克风访问',
      allowMicDesc:
        '启用麦克风以拍摄视频.\n\n如果您拒绝麦克风访问,您将无法拍摄视频并完成验证过程.',
    },
  },
};
