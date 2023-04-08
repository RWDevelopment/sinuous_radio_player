import { html } from 'sinuous';

const PlayAnim = () => {
    return html`
    <li class="playing">
        <span class="playing__bar playing__bar1"></span>
        <span class="playing__bar playing__bar2"></span>
        <span class="playing__bar playing__bar3"></span>
    </li>
    `;
}

export default PlayAnim;