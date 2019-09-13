
const developerMode = false;
const DEFAULT_ERROR_MSG = "Something went wrong";
const DEFAULT_CONTEXT = "_default";
/**
 * OstSdkErrors
 * To get Message of OstError based on workflow type.
 */
class OstSdkErrors {
    constructor() {
      allErrors[ DEFAULT_CONTEXT ] = BaseErrorMessages;
    }

    getErrorMessage(ostWorkflowContext, ostError) {

      // Parameter validation
      if (!ostError) {
        return DEFAULT_ERROR_MSG;
      }
      let errorCode = ostError.getErrorCode();
      if ( !errorCode ) {
        return DEFAULT_ERROR_MSG;
      }


      let workflowType = ostWorkflowContext ? ostWorkflowContext.WORKFLOW_TYPE : null;
      workflowType = workflowType || DEFAULT_CONTEXT;

      let errMsg;
      if ( allErrors[workflowType] ) {
        errMsg = allErrors[workflowType][ errorCode ];
      }

      if ( !errMsg ) {
        errMsg = allErrors[DEFAULT_CONTEXT][ errorCode ];
      }

      return errMsg || DEFAULT_ERROR_MSG;

    }
}

// Utility methods
const _getErrorMessageFor = function (workflowErrorMessages, errorCode) {
  let errorMessages = Object.assign(developerMode ? DeveloperErrorMessages : {}, BaseErrorMessages, workflowErrorMessages);
  let errorMessage = errorMessages[errorCode];

  if (errorMessage) return errorMessage;
  return DEFAULT_ERROR_MSG;
};

const allErrors = {
  "ACTIVATE_USER": {

  },
  "ADD_SESSION": {

  },
  "GET_DEVICE_MNEMONICS": {

  },
  "PERFORM_QR_ACTION": {

  },
  "AUTHORIZE_DEVICE_WITH_QR_CODE": {

  },
  "AUTHORIZE_DEVICE_WITH_MNEMONICS": {

  },
  "INITIATE_DEVICE_RECOVERY": {

  },
  "ABORT_DEVICE_RECOVERY": {

  },
  "RESET_PIN": {

  },
  "LOGOUT_ALL_SESSIONS": {

  },
  "UPDATE_BIOMETRIC_PREFERENCE": {

  }
};

const BaseErrorMessages = {
  NETWORK_ERROR: "Request could not be executed due to cancellation, a connectivity problem or timeout.",

  INVALID_MNEMONICS:
    "The 12 word passphrase you provided is incorrect. ",

  INVALID_QR_TRANSACTION_DATA:
    "The QR code for executing a transaction is not well formed. To know the data definition for QR code based on type of operations please visit https://dev.ost.com/platform ",

  INVALID_USER_PASSPHRASE:
    "The 6 digit PIN you entered is not correct.",

  MAX_PASSPHRASE_VERIFICATION_LIMIT_REACHED:
    "The maximum number of 'authenticating with PIN' attempts has been reached. Please try again a bit later.",

  DEVICE_CAN_NOT_BE_AUTHORIZED: "Unable to authorize this device. Please ensure the device is 'Registered' for this user with OST platform. Only a registered device can be authorized.",

  SESSION_NOT_FOUND:
    "The device doesn't has any active session. Please authorize a session before doing any transaction. Workflow details provided at https://dev.ost.com/platform/docs/sdk/references ",

  INVALID_QR_CODE: "The QR code does not contain valid data definition. To know the data definition for QR code based on type of operations please visit https://dev.ost.com/platform",

  RECOVERY_KEY_GENERATION_FAILED: "Failed to generate Recovery key. Inspect if a correct input values required are being sent and re-submit the request. ",

  WORKFLOW_FAILED:
    "Something went wrong, please try again",

  // Rare Errors
  DEVICE_UNAUTHORIZED:
    "Unable to perform the operation as the device not authorized. For details on how to authorize a device please visit https://dev.ost.com/platform/docs/sdk/references ",

  DEVICE_CAN_NOT_BE_REVOKED:
    "Cannot complete the revoke device operation. Only an authorized device can be revoked. Please ensure you are trying to revoke a valid device and re-submit the request.",
};

const DeveloperErrorMessages = {

  //Developer Errors
  SDK_ERROR: "An internal SDK error has occurred.",
  INVALID_CERTIFICATE: "Certificate provided by Ost platform is invalid Or it has been compromised. Please re-try in some other network and if the problem persists contact support@ost.com .",
  INVALID_USER_ID: "Unable to recognize the user id. Please inspect for what is being sent, rectify and re-submit.",
  INVALID_API_END_POINT: "Invalid OST server url",
  INVALID_NETWORK_SECURITY_CONFIG: "Invalid network_security_config file",
  INVALID_WORKFLOW_CALLBACK: "Callback is essential for a workflow to continue running, it cannot be null.",
  API_RESPONSE_ERROR: "OST Platform Api ed error.",
  CONFIG_READ_FAILED: "Failed to read config file. Please place the ost-sdk config file in main/assets folder.",
  INVALID_BLOCK_GENERATION_TIME: "Invalid configuration 'BLOCK_GENERATION_TIME'. It must be an Integer greater than zero",
  INVALID_PIN_MAX_RETRY_COUNT: "Invalid configuration 'PIN_MAX_RETRY_COUNT'. It must be an Integer greater than zero",
  INVALID_SESSION_BUFFER_TIME: "Invalid configuration 'SESSION_BUFFER_TIME'. It must be long greater than or equal to zero",
  INVALID_PRICE_POINT_CURRENCY_SYMBOL: "Unable to recognize 'PRICE_POINT_CURRENCY_SYMBOL'. For details on how supported currencies please vist https://dev.ost.com/platform/docs/api ",
  INVALID_REQUEST_TIMEOUT_DURATION: "Invalid configuration 'REQUEST_TIMEOUT_DURATION'. It must be Integer greater than zero.",
  INVALID_NO_OF_SESSIONS_ON_ACTIVATE_USER: "Invalid configuration 'NO_OF_SESSIONS_ON_ACTIVATE_USER'. It must be an Integer greater than zero and less than 6",
  INVALID_API_RESPONSE: "Unable to recognize the API response object sent and so cannot be executed.",
  INVALID_JSON_STRING: "The provided json string is invalid.",
  INVALID_JSON_ARRAY: "The provided json array string is invalid.",
  INVALID_REVOKE_DEVICE_ADDRESS: "Unable to recognise revoke device address. Please ensure you are sending a null value and re-submit the request.",
  NO_PENDING_RECOVERY:
    "Could not find any pending device recovery request. For details on how to check the status of the recovery please vist https://dev.ost.com/platform/docs/sdk ",
  EIP712_FAILED:
    "Unable to sign parameters using EIP 712 and verify the signature.",
  RULES_NOT_FOUND:
    "Unable to recognize the Rule. Please inspect a valid rule name that exists in your economy is passed and its not null.",
  DEVICE_NOT_SETUP:
    "Unable to recognize the device. Please setup this device for the user using workflow provided at https://dev.ost.com/platform/docs/sdk/references",
  DEVICE_NOT_REGISTERED:
    "Device is not registered. To make any api to OST server device need to be registered",
  POLLING_TIMEOUT:
    "Polling timeout. This can be intermittent event with a request failing followed by successful one.",
  INVALID_TOKEN_ID:
    "The token id sent in Transaction QR code is not matching with the current user's token id. Rectify the value is being sent in token Id field and re-submit the request.",
  INVALID_RECOVER_DEVICE_ADDRESS: "Invalid device address. This address can not be recovered.",

  INVALID_SESSION_EXPIRY_TIME:
    "The expiry time provided is invalid",

  INVALID_SESSION_SPENDING_LIMIT:
    "The spending limit provided is invalid should be more than 0",

  RECOVERY_OWNER_ADDRESS_NOT_FOUND: "Recovery owner is not set for this user. This address is set during user activation. Please verify the user has been successfully activated.",

  INSUFFICIENT_DATA: "The device does not have sufficient data to perform this action.",

  INVALID_SESSION_ADDRESS: "Unable to recognize the session address. Inspect if a correct value is being sent and its not null. ",

  FAILED_TO_SIGN_DATA: "Unable to sign data. Visit https://dev.ost.com/platform/docs/sdk for detailed SDK references. Please ensure the input is well formed and re-submit the request.",

  INVALID_DEVICE_ADDRESS: "Incorrect device address. Please inspect the value being sent is correct and not null, rectify and re-submit.",

  GENERATE_PRIVATE_KEY_FAIL: "This is a generic error that occurs when sdk fails to generate any one of Api Key, Device Key or Session Key. This can be intermittent issue, please re-start the workflow. If Problem persists contact support@ost.com .",

  INVALID_PASSPHRASE_PREFIX: "Unable to recognize the Passphrase prefix. Please ensure Passphrase prefix is not null or it's string length is not less than 30. ",
  USER_NOT_ACTIVATED:
    "The user is not activated yet. Please setup user's wallet to enable their participation in your economy. ",
  USER_ALREADY_ACTIVATED:
    "The User is already activated",
  USER_ACTIVATING: "User activation flow is already in progress. Please check the status a bit later",
  WORKFLOW_CANCELLED: "Workflow got cancelled, possibly because one or more input parameters require a different type of information.",
  INVALID_NEW_USER_PASSPHRASE:
    "The new 6 digit PIN you entered is not correct.",
  INVALID_ADDRESS_TO_TRANSFER: "INVALID_ADDRESS_TO_TRANSFER",
  INVALID_AMOUNT: "INVALID_AMOUNT",
  INVALID_WORKFLOW: "INVALID_WORKFLOW",
  INVALID_RECOVERY_ADDRESS: "INVALID_RECOVERY_ADDRESS",

  //Future
  USER_PASSPHRASE_VALIDATION_LOCKED: "Can not validate user passphrase because of too many wrong attempts.",

  UNKNOWN:
    "Unknown error",
};


const ostSdkErrors = new OstSdkErrors();

export {ostSdkErrors};