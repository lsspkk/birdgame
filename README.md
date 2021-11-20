# Ominaisuudet

- pwa, ei selaimen palkkia
- valitse ensin kuka pelaa, tervetulonäyttö
- näytä joukkueen tiedot, tervetulonäyttö2
- ulkoasu, kuvan tunnistus
- ulkoasu, äänen tunnistus
- lintujen nimet audiona
- oikean linnun kuva näkyviin, jos on vastannut väärin

- ulkoasu: pelin valinta
- ulkoasu: taso läpäisty
- ulkoasu: oma lintutietous

- paras tulos/taso joukkueelta
- joukkueen paras lintutietäjä
- Näkyy useampi taso, jos on läpäisty jo tällä joukkueella

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

# Tunnista kuva

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

# Opittua

splice muuttaa arrayn arvoa, ja palauttaa myös muuttuneen arvon
slice luo kopion
eli a = [ 1, 2, 3]
b = a.slice(1) => b = [2,3], a = [1,2,3]

b = a.splice(1) => b = [2,3], a = [2,3]

React-funktion paluutyyppi ReactElement
https://nextjs.org/docs/basic-features/typescript#custom-app

uusin docker
https://websiteforstudents.com/how-to-install-docker-and-docker-compose-on-ubuntu-16-04-18-04/

Jos haluaa aina päivittää sivulle tulevan datan, niin...
https://swr.vercel.app/docs/with-nextjs

Mongoose ja typescript
https://mongoosejs.com/docs/typescript.html

https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1

nextjs link, typescript ja komponentit

<Link><OmaButton>Esim</OmaButton></Link>
Tämäkään ei auta, valittaa tuossa OmaButton -kohdassa.
https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/

Typescript styled-component error: “Type '{ children: string; }' has no properties in common with type 'IntrinsicAttributes'.”
