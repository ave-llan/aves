An Alexa skill for getting important bird information.

# Setup
Follow the instructions in this [tutorial](https://developer.amazon.com/public/community/post/Tx3DVGG0K0TPUGQ/New-Alexa-Skills-Kit-Template:-Step-by-Step-Guide-to-Build-a-Fact-Skill).
After cloning this project run:
```
npm install
npm run zip
```
to generate `aves-skill.zip` which you can upload to AWS lambda.

# config.json
make a top level `config.json` file with the following fields:
```
{
  "APP_ID": "amzn1.echo-sdk-ams.app.[your-unique-value-here]"
}
```

# Thanks to
[eBird](http://ebird.org) for the bird taxonomy.
[Wikipedia](https://en.wikipedia.org/wiki/Bird) for bird descriptions.
