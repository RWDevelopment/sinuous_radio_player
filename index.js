import '@picocss/pico';
import './css/custom.css';
import shuffleLetters from 'shuffle-letters';
import stations from './stations/stations';
import {o,html} from 'sinuous';
import {subscribe} from 'sinuous/observable';
import Sun from './icons/sun';
import Moon from './icons/moon';
import Play from './icons/play';
import Pause from './icons/pause';
import PlayAnim from './components/play_animation';

const loading = html`<span aria-busy="true"></span>`;

const App = () => {

    let isLight = true,
        theme = o('light');
        playBtn = o(Play),
        source = o(stations[0].stream),
        station = o(stations[0].name),
        vol = o(.25),
        showVol = o(Math.floor(vol() * 100)),
        icon = o(isLight? Sun : Moon),
        anim = o(null);

    document.title = station();

    subscribe(() => {
        document.documentElement.setAttribute('data-theme', `${theme()}`);
    }); 

    const toggleTheme = (e) => {
        e.preventDefault();
        isLight = !isLight;
        theme(isLight? 'light':'dark');
        icon(isLight? Sun : Moon);
    }

    const changeStation = (e) => {
        e.preventDefault();
        anim(null);
        player.pause();
        source(e.target.getAttribute('data-source'));
        station(e.target.getAttribute('data-name'));
        player.src = source();
        document.title = station();
        shuffleLetters(document.querySelector('li strong'),{
            iterations: 12,
            fps: 60,
            onComplete: () => {
                play();
            }
        });
    }

    const changeVolume = (e) => {
        e.preventDefault();
        vol(e.target.value);
        showVol(Math.floor(vol() * 100));
        player.volume = vol();
        document.title = `${station()} | vol. ${showVol()}  %`;
    }

    const changeAnim = (e) => {
        e.preventDefault();
        player.volume < 0.01 ? anim(null)
        : !player.paused ? anim(PlayAnim)
        : anim(null);
    }

    const playRadio = (e) => {
        e.preventDefault();
        play();
    }

    const play = () => {

        if(player.paused) {

            player.readyState < 2 ? anim(loading) : anim(null);
            player.play();
            player.onplaying = () => {
                playBtn(Pause);
                player.volume > 0.01 ? anim(PlayAnim) : anim(null);
            }
            
        } else {

            player.pause();
            player.onpause = () => {
                playBtn(Play);
                anim(null);
            }

        }

    }

    const radio = html`<article><nav><ul><li><a href="#" onclick=${playRadio} data-play>${playBtn}</a></li><li><strong>${station}</strong></li>${anim}</ul><ul><li><a href="#" onclick=${toggleTheme}>${icon}</a></li></ul></nav><audio src=${source} preload="none"/><input type="range" min="0.00" max="1.00" step=".01" value=${vol} oninput=${changeVolume} onchange=${changeAnim} id="volume" name="volume" data-tooltip="vol.${showVol} %" /><details><summary>stations</summary><section><ul>${() => stations.map(s => html`<li><a href="#" data-source="${s.stream}" data-name="${s.name}" onclick=${changeStation}>${s.name}</a> <sup><mark>${s.category}</mark></sup></li>`)}</ul></section><label>volume ${showVol} %</label></details></article>`;

    const view = html`<main class="container"><${radio}/></main>`;
    return view;

};
  
document.body.append(html`<${App}/>`);
const player = document.querySelector('audio');
player.volume = vol();