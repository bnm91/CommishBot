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

exports.produceImmediateResponse = produceImmediateResponse;
exports.produceResponseObjectForText = produceResponseObjectForText;
