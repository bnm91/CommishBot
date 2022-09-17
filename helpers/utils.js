/**
 * Produce an immediate response with some text.
 */
function produceImmediateResponse(response) {
  return produceResponseObjectForText(response);
}

/**
 * Produce a simple text response object.
 */
function produceResponseObjectForText(text) {
  return {
    text: text,
  };
}

function formatNumber(floatNumber) {
  return Math.round(floatNumber*100)/100
}

exports.produceImmediateResponse = produceImmediateResponse;
exports.produceResponseObjectForText = produceResponseObjectForText;
exports.formatNumber = formatNumber;