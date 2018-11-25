import json

#------------------------------Part1--------------------------------
# In this part we define a list that contains the player names, and 
# a dictionary with player biographies
Player_LIST = ["Maradona", "Meroni", "Mazzola", "Junior", "Belotti", "Graziani"]

Player_BIOGRAPHY = {
"Maradona":"Diego Armando Maradona (Lanús, 30 ottobre 1960) è un allenatore di calcio, dirigente sportivo ed ex calciatore argentino, di ruolo centrocampista, tecnico dei Dorados. Capitano della nazionale argentina vincitrice del campionato del mondo 1986. Noto anche come El Pibe de Oro, è considerato uno dei più grandi calciatori di tutti i tempi",
"Meroni":"La biografia di Meroni",
"Mazzola":"Valentino Mazzola (Cassano d'Adda, 26 gennaio 1919 – Superga, 4 maggio 1949) è stato un calciatore italiano, di ruolo attaccante e centrocampista. Considerato tra i più grandi numeri 10 della storia del calcio e, secondo alcuni, il migliore calciatore italiano di tutti i tempi, Mazzola fu capitano e simbolo del Grande Torino, la squadra riconosciuta come una delle più forti al mondo nella seconda metà degli anni '40, con cui vinse cinque campionati, e capitano della Nazionale italiana per un biennio.",
"Junior":"Leovegildo Lins da Gama Júnior, meglio noto semplicemente come Júnior o Léo Júnior (João Pessoa, 29 giugno 1954), è un ex calciatore brasiliano ricordato in Italia per la militanza nel Torino di Radice e nel Pescara di Galeone. Nel 2004 è stato inserito da Pelé nel FIFA 100, lista che includeva i 125 migliori giocatori viventi ancora oggi",
"Belotti":"La biografia di Belotti",
"Mazzola":"La biografia di Mazzola",
"Graziani":"La biografia di Graziani" }
#------------------------------Part2--------------------------------
# Here we define our Lambda function and configure what it does when 
# an event with a Launch, Intent and Session End Requests are sent. # The Lambda function responses to an event carrying a particular 
# Request are handled by functions such as on_launch(event) and 
# intent_scheme(event).
def lambda_handler(event, context):
    if event['session']['new']:
        on_start()
    if event['request']['type'] == "LaunchRequest":
        return on_launch(event)
    elif event['request']['type'] == "IntentRequest":
        return intent_scheme(event)
    elif event['request']['type'] == "SessionEndedRequest":
        return on_end()
#------------------------------Part3--------------------------------
# Here we define the Request handler functions
def on_start():
    print("Session Started.")

def on_launch(event):
    onlunch_MSG = "Ciao, benvenuto al chiedimi il calciatore di Alexa Skill. I calciatori a disposizione: " + ', '.join(map(str, Player_LIST)) + ". "\
    "Se vuoi sapere qualcosa di un calciatore puoi farlo in questo modo: dimmi di Maradona"
    reprompt_MSG = "Vuoi che ti dica qualcosa di un calciatore particolare?"
    card_TEXT = "Seleziona un calciatore"
    card_TITLE = "Scegli un calciatore"
    return output_json_builder_with_reprompt_and_card(onlunch_MSG, card_TEXT, card_TITLE, reprompt_MSG, False)

def on_end():
    print("Session Ended.")
#-----------------------------Part3.1-------------------------------
# The intent_scheme(event) function handles the Intent Request. 
# Since we have a few different intents in our skill, we need to 
# configure what this function will do upon receiving a particular 
# intent. This can be done by introducing the functions which handle 
# each of the intents.
def intent_scheme(event):
    
    intent_name = event['request']['intent']['name']

    if intent_name == "playerBio":
        return player_bio(event)        
    elif intent_name in ["AMAZON.NoIntent", "AMAZON.StopIntent", "AMAZON.CancelIntent"]:
        return stop_the_skill(event)
    elif intent_name == "AMAZON.HelpIntent":
        return assistance(event)
    elif intent_name == "AMAZON.FallbackIntent":
        return fallback_call(event)
#---------------------------Part3.1.1-------------------------------
# Here we define the intent handler functions
def player_bio(event):
    name=event['request']['intent']['slots']['player']['value']
    player_list_lower=[w.lower() for w in Player_LIST]
    if name.lower() in player_list_lower:
        reprompt_MSG = "Di quale calciatore vuoi che ti racconto?"
        card_TEXT = "Hai selezionato " + name.lower()
        card_TITLE = "Hai selezionato " + name.lower()
        return output_json_builder_with_reprompt_and_card(Player_BIOGRAPHY[name.lower()], card_TEXT, card_TITLE, reprompt_MSG, False)
    else:
        wrongname_MSG = "Non hai detto il nome di un calciatore. Se non sai quale scegliere chiedi aiuto."
        reprompt_MSG = "Di quale calciatore vuoi che ti racconto?"
        card_TEXT = "Usa il suo nome."
        card_TITLE = "Nome sbagliato."
        return output_json_builder_with_reprompt_and_card(wrongname_MSG, card_TEXT, card_TITLE, reprompt_MSG, False)
        
def stop_the_skill(event):
    stop_MSG = "Grazie. Ciao!"
    reprompt_MSG = ""
    card_TEXT = "Ciao."
    card_TITLE = "Ciao Ciao."
    return output_json_builder_with_reprompt_and_card(stop_MSG, card_TEXT, card_TITLE, reprompt_MSG, True)
    
def assistance(event):
    assistance_MSG = "Puoi scegliere tra questi calciatori: " + ', '.join(map(str, Player_LIST)) + ". Fai attenzione a pronunciare il nome esatto quando selezioni un calciatore."
    reprompt_MSG = "Vuoi sapere di piu di uno dei calciatori?"
    card_TEXT = "Hai chiesto aiuto."
    card_TITLE = "Aiuto"
    return output_json_builder_with_reprompt_and_card(assistance_MSG, card_TEXT, card_TITLE, reprompt_MSG, False)

def fallback_call(event):
    fallback_MSG = "Non ti posso aiutare, prova a rifare la domanda o a chiedere aiuto dicendo HELP."
    reprompt_MSG = "Vuoi sapere di piu di uno dei calciatori?"
    card_TEXT = "Ha sbagliato domanda."
    card_TITLE = "Domanda sbagliata."
    return output_json_builder_with_reprompt_and_card(fallback_MSG, card_TEXT, card_TITLE, reprompt_MSG, False)
#------------------------------Part4--------------------------------
# The response of our Lambda function should be in a json format. 
# That is why in this part of the code we define the functions which 
# will build the response in the requested format. These functions
# are used by both the intent handlers and the request handlers to 
# build the output.
def plain_text_builder(text_body):
    text_dict = {}
    text_dict['type'] = 'PlainText'
    text_dict['text'] = text_body
    return text_dict

def reprompt_builder(repr_text):
    reprompt_dict = {}
    reprompt_dict['outputSpeech'] = plain_text_builder(repr_text)
    return reprompt_dict
    
def card_builder(c_text, c_title):
    card_dict = {}
    card_dict['type'] = "Simple"
    card_dict['title'] = c_title
    card_dict['content'] = c_text
    return card_dict    

def response_field_builder_with_reprompt_and_card(outputSpeach_text, card_text, card_title, reprompt_text, value):
    speech_dict = {}
    speech_dict['outputSpeech'] = plain_text_builder(outputSpeach_text)
    speech_dict['card'] = card_builder(card_text, card_title)
    speech_dict['reprompt'] = reprompt_builder(reprompt_text)
    speech_dict['shouldEndSession'] = value
    return speech_dict

def output_json_builder_with_reprompt_and_card(outputSpeach_text, card_text, card_title, reprompt_text, value):
    response_dict = {}
    response_dict['version'] = '1.0'
    response_dict['response'] = response_field_builder_with_reprompt_and_card(outputSpeach_text, card_text, card_title, reprompt_text, value)
    return response_dict