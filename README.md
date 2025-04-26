# Birdgame

Birdgame is an educational web application designed to help users learn to recognize birds by their images and sounds. The game is suitable for individuals and groups (teams), and tracks progress, knowledge, and scores for each user or team. Below is an overview of the main features and how the application works.

## Features

- **Image and Sound Recognition:** Users can play games where they identify birds either by their images or by their sounds.
- **Personal and Team Progress Tracking:** The app saves each user's or team's progress, including which birds have been learned and the best scores achieved.
- **Levels and Difficulty:** The game is divided into levels. Each level presents a set of birds to recognize, with increasing difficulty.
- **Multiple Game Modes:** Users can choose between different game types, such as identifying birds by image or by sound.
- **Best Scores and Knowledge:** The app keeps track of the best results for each team and shows which birds are best known.
- **Team Management:** Teams can be created and joined with a password. Each team can have multiple members, and the best results are tracked per team.
- **History and Statistics:** The app saves a history of answers, so users can see which birds they have learned and which ones need more practice.
- **Progressive Unlocking:** New levels become visible and playable as previous levels are completed.
- **Audio Features:** Bird names can be played as audio, helping users learn pronunciation.
- **Responsive Design:** The app is designed to work well on both desktop and mobile devices, including as a Progressive Web App (PWA).
- **Authentication and Security:** Teams are protected by passwords, and there are features for password management and secure joining.

## How It Works

1. **Choose or Create a Team:** On the welcome screen, users select an existing team or create a new one by entering a team name and password.
2. **Select Game Mode and Level:** Users choose whether to play an image or audio recognition game, and select the desired level.
3. **Play the Game:** For each round, the app presents several bird images or plays a bird sound. The user must select the correct bird from the options.
4. **Feedback:** After each answer, the app provides immediate feedback, showing the correct answer and playing a happy or sad sound depending on the result.
5. **Track Progress:** The app saves which birds have been answered correctly or incorrectly, and updates the team's knowledge and scores.
6. **View Results and History:** Users can view their team's best scores, knowledge statistics, and answer history.
7. **Unlock New Levels:** As users complete levels, new, more challenging levels become available.

## Technical Overview

- **Frontend:** Built with React and Next.js (see the `pages` directory for main components and routes).
- **Backend:** Uses MongoDB to store teams, scores, and knowledge data.
- **API:** Custom API routes under `/api` handle saving and retrieving scores, teams, and user data.
- **State Management:** Uses React state and localStorage to keep track of the current user, team, and progress.
- **Models:** See `models/ScoreInterface.tsx` for data structures used to store game results and bird knowledge.

## Example Game Flow

1. User logs in or creates a team.
2. User selects "Identify by Image" and chooses Level 1.
3. The app shows three bird images and says the name of one bird.
4. User selects an image. If correct, a happy bird and sound are shown; if incorrect, the correct bird is revealed with a sad sound.
5. After several rounds, the level is completed and the result is saved.
6. User can view which birds are well known and which need more practice.

## Development Notes

- The app is designed to be easily extended with new birds, levels, and game types.
- All user and team data is stored securely in the backend.
- The UI is optimized for both desktop and mobile use.

For more details, see the feature TODO list below and explore the code in the `pages` directory for implementation specifics.

# Ominaisuudet TODO-lista

- ääni/kuvatietous
- ulkoasu: oma lintutietous
- mahdollisuus opetella haluttua lintujoukkoa
- paras tulos/taso joukkueelta
- joukkueen paras lintutietäjä
- Näkyy useampi taso, jos on läpäisty jo tällä joukkueella
- näytä joukkueen tiedot, tervetulonäyttö2
- lintujen nimet audiona
- joukkueen lisäys vain salasanalla, parempi ratkaisu...
- vielä paremmat ikonit

- x ulkoasu: taso läpäisty
- x paremmat ikonit
- x joukkueen lisäys vain salasanalla
- x ulkoasu, kuvan tunnistus
- x ulkoasu, äänen tunnistus
- x oikean linnun kuva näkyviin, jos on vastannut väärin
- x ulkoasu: pelin valinta
- x pwa, ei selaimen palkkia
- x valitse ensin kuka pelaa, tervetulonäyttö

x Tallenna mongoon joukkueet
x tallenna mongoon pisteet ja tiedot
x Valitse peli/taso: Tunnista kuva

x Tallenna localstorageen mikä taso.

x tallenna historiatiedot, mitä vastattu milloinkin,
mitkä linnut osataan
x näytä historiatiedot
x mahdollista salasanan vaihto
x kysy salasanaa
x tunnista ääni
x Valitse pelaajan joukkue/hahmo

## Tunnista kuva

taso 1
näytä kolme linnun kuvaa, lausu linnun nimi
jos oikein, näytä iloinen lintu ja iloinen ääni
jos väärin, näytä surullinen lintu ja surullinen ääni

Arvonta: älä kysy samaa lintua, ja vältä näyttämästä saman linnun kuvaa.
Arvo kaikki etukäteen.

taso 2.. sama, vaikeammat linnut

taso 3 6 lintua, helpot linnut

taso 4 6 lintua, vaikeammat linnut

taso 5 6 lintua, kaikki linnut

# Tunnista ääni/kuva

Soita ääni ja näytä kuvat

Taso 1 kolme lintua, tosi helpot/erilliset Äänet
Taso 2 kuusi lintua, suht helpot äänet
Taso 3 kuusi lintua, kaikki äänet

Kun vastattu oikein, soita linnun nimi

High-score tallennus:
Kun taso alkaa, kysy uid backendiltä, tallenna uid ja aika ja taso
Kun sovellus alkaa, kysy device uid backendiltä
Jos avatar/device uid ja uid

Tiedot -näyttö

Kuvat

Äänet

Ikonit

<div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> 
from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

## Opittua

Jos haluaa aina päivittää sivulle tulevan datan, niin...
https://swr.vercel.app/docs/with-nextjs

Mongoose ja typescript
https://mongoosejs.com/docs/typescript.html

https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1

nextjs link, typescript ja komponentit

<Link><OmaButton>Esim</OmaButton></Link>
Tämäkään ei auta, valittaa tuossa OmaButton -kohdassa.
https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/

Typescript styled-component error: "Type '{ children: string; }' has no properties in common with type 'IntrinsicAttributes'."

# AI Assistant Working Instructions

These are the instructions the AI assistant follows when working with this codebase:

1. **Understand the Data Models**:

   - The main interfaces are `ScoreInterface`, `IGameResult`, and `IBirdKnowledge`.
   - `ScoreInterface` aggregates game results and bird knowledge for a user.
   - `IGameResult` tracks scores for a specific level and result type (image/audio).
   - `IBirdKnowledge` tracks right/wrong answers for each bird, split by answer type.

2. **Score Update Logic**:

   - The `updateOldScore` function updates an existing score with new results and knowledge.
   - It keeps only the 10 latest scores per result type/level.
   - It merges new knowledge into existing knowledge, updating right/wrong counts and adding new birds as needed.
   - It sorts knowledge by the total number of correct answers (descending).

3. **API Data Contracts**:

   - `ScoreBody` defines the expected structure for POST requests to the scores API.
   - The code expects `userId`, `knowledge`, and `gameResult` in the request body.

4. **Immutability and Side Effects**:

   - The update function mutates the `oldScore` object directly.
   - When updating knowledge, it removes `_id` fields from each bird knowledge entry.

5. **Constants**:

   - `emptyBirdKnowledge` and `emptyScore` provide default/empty values for initialization.

6. **TypeScript & Mongoose**:

   - The code uses TypeScript interfaces and partial Mongoose `Document` types, suggesting a Node.js/Express backend with MongoDB.

7. **General Cursor AI Practices**:
   - Always read relevant file sections before making edits.
   - Use semantic and regex search to locate code, types, or logic as needed.
   - When editing, minimize unchanged code and clearly mark changes.
   - Ensure all imports, types, and logic are consistent and correct.
   - If creating new files or endpoints, follow the structure and conventions seen in the codebase.
