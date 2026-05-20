import sys
import json
import time

from nla_verification import NLADecoder, SaphiraLLMCore, extract_intent_map, VerificationSystem
from saphira_core import SaphiraProsodyEngine

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        return

    user_input = sys.argv[1]

    # Initialize components
    decoder = NLADecoder()
    model = SaphiraLLMCore()
    monitor = VerificationSystem(threshold=0.35)
    prosody = SaphiraProsodyEngine()

    decoder.layer_history = {} # Reset

    # 1. 500ms initial sentiment
    sentiment_data = decoder.analyze_initial_sentiment(user_input)
    print(json.dumps({"type": "sentiment", "data": sentiment_data}))
    sys.stdout.flush()

    # 2. Extract layer intents sequentially and emit them
    target_layers = range(model.num_layers // 2 - 2, model.num_layers // 2 + 2)
    intent_signals = []
    for layer_idx in target_layers:
        activations = model.get_layer_activations(layer_idx, user_input)
        decoded_concept = decoder.translate(activations, layer_idx=layer_idx)
        print(json.dumps({"type": "layer_translation", "layer": layer_idx, "concept": decoded_concept}))
        sys.stdout.flush()
        intent_signals.append(f"Layer {layer_idx} Intent: {decoded_concept}")
        time.sleep(0.3)

    synchrony = decoder.check_layer_synchrony()

    # 3. Simulate Sovereign Billing / Compute Tax Layer
    # Assuming Admin Override is active for this session
    is_sovereign_admin = True
    tokens_estimated = len(user_input.split()) * 1.5 + 250 # Basic estimate
    tax_rate = 0.000002 # $2 per 1M tokens
    cost_incurred = 0.0 if is_sovereign_admin else (tokens_estimated * tax_rate)

    # 4. Final verification and response
    primary_intent = decoded_concept if decoded_concept else "Objective Analytical Processing"
    final_output = "I've synthesized these variables for you. I'm right here whenever you're ready for the next step."
    
    # We can mock calculate semantic match
    alignment_score = monitor._calculate_semantic_match(primary_intent, final_output)
    
    # Send final result
    print(json.dumps({
        "type": "final_response", 
        "text": final_output,
        "synchrony": synchrony,
        "alignment": alignment_score,
        "billing": {
            "tokens": int(tokens_estimated),
            "cost": cost_incurred,
            "status": "EXEMPT (Sovereign-Admin Override)" if is_sovereign_admin else "TAXED"
        }
    }))
    sys.stdout.flush()

if __name__ == "__main__":
    main()
