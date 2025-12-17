/* ==================================================================
   FILE: script.js
   AUTHOR: HUNG 88 ULTIMATE
   ================================================================== */

// --- CORE APP ---
const app = {
    balance: 100000000,
    init: function() {
        this.updateBalanceUI();
        this.runRandomJackpots();
        this.startFakeChat();
        this.initHistory();
    },
    updateBalanceUI: function() {
        document.getElementById('userBalance').innerText = this.balance.toLocaleString('vi-VN');
    },
    openGame: function(id) {
        if(id === 'xocdia') document.getElementById('modal-xocdia').classList.add('active');
        else if(id === 'taixiu') document.getElementById('modal-taixiu').classList.add('active');
    },
    closeAll: function() {
        document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('active'));
        gameXD.reset();
        gameTX.reset();
    },
    addTransaction: function(game, gate, money, win) {
        const table = document.getElementById('history-table');
        if (!table) return;
        const row = `<tr>
            <td style="padding: 10px; color:#777">${new Date().toLocaleTimeString()}</td>
            <td style="color:gold">${game}</td>
            <td>${gate}</td>
            <td>${money.toLocaleString()}</td>
            <td class="${win ? 'text-win' : 'text-lose'}">${win ? 'THẮNG' : 'THUA'}</td>
        </tr>`;
        table.insertAdjacentHTML('afterbegin', row);
        if(table.children.length > 5) table.lastElementChild.remove();
    },
    initHistory: function() {
        this.addTransaction('Tài Xỉu', 'TÀI', 500000, true);
        this.addTransaction('Xóc Đĩa', 'LẺ', 200000, false);
    },
    runRandomJackpots: function() {
        const ids = ['pot-tx', 'pot-bc', 'pot-1', 'pot-2', 'pot-3', 'pot-4'];
        setInterval(() => {
            const id = ids[Math.floor(Math.random() * ids.length)];
            const el = document.getElementById(id);
            if(el) {
                let val = parseInt(el.innerText.replace(/,/g, ''));
                val += Math.floor(Math.random() * 50000);
                el.innerText = val.toLocaleString('vi-VN');
                el.style.color = '#fff';
                setTimeout(() => el.style.color = '#ffd700', 300);
            }
        }, 2000);
    },
    startFakeChat: function() {
        const users = ['HungDaiGia', 'Tuan789', 'Mimi_Cute', 'BaoAnVip', 'ThanhLong'];
        const msgs = ['Tài xỉu cầu đẹp quá', 'Xóc đĩa lẻ 3 cây rồi', 'Admin ơi nạp thẻ bao lâu?', 'Hôm nay đen quá anh em ơi', 'Vừa nổ hũ 2 tỏi ngon ơ'];
        const chatBox = document.getElementById('chatBox');
        
        setInterval(() => {
            const u = users[Math.floor(Math.random()*users.length)];
            const m = msgs[Math.floor(Math.random()*msgs.length)];
            const line = `<div class="chat-msg"><span class="chat-user">${u}:</span> ${m}</div>`;
            if (chatBox) {
                chatBox.insertAdjacentHTML('beforeend', line);
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }, 4000);
    },
    sendChat: function() {
        const inp = document.getElementById('chatInput');
        if(!inp.value) return;
        const chatBox = document.getElementById('chatBox');
        chatBox.insertAdjacentHTML('beforeend', `<div class="chat-msg"><span class="chat-user vip">Tôi:</span> ${inp.value}</div>`);
        inp.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
};

// --- GAME XÓC ĐĨA ---
const gameXD = {
    bet: null,
    isRolling: false,
    amount: 1000000,
    select: function(side) {
        if(this.isRolling) return;
        this.bet = side;
        document.querySelectorAll('#modal-xocdia .bet-option').forEach(e => e.classList.remove('active'));
        document.getElementById('xd-' + side).classList.add('active');
        document.getElementById('xd-status').innerText = `Đã chọn: ${side.toUpperCase()} - Cược 1M`;
        document.getElementById('xd-status').style.color = 'gold';
    },
    shake: function() {
        if(!this.bet) { alert("Vui lòng chọn CHẴN hoặc LẺ"); return; }
        if(this.isRolling) return;
        this.isRolling = true;
        
        const bowl = document.getElementById('xd-bowl');
        const btn = document.getElementById('btn-xd-shake');
        const status = document.getElementById('xd-status');
        
        bowl.classList.remove('open');
        btn.disabled = true;
        btn.innerText = "ĐANG XỐC...";
        status.innerText = "Đang lắc...";
        
        setTimeout(() => {
            bowl.classList.add('shaking');
            
            const coins = [0,0,0,0].map(() => Math.random() < 0.5 ? 0 : 1);
            const redCount = coins.filter(c => c === 0).length;
            const result = (redCount % 2 === 0) ? 'chan' : 'le';
            
            coins.forEach((c, i) => {
                const el = document.getElementById('c'+(i+1));
                el.className = c === 0 ? 'coin red' : 'coin white';
                el.style.transform = `translate(${Math.random()*30-15}px, ${Math.random()*30-15}px)`;
            });

            setTimeout(() => {
                bowl.classList.remove('shaking');
                status.innerText = "Chuẩn bị mở bát...";
            }, 2000);

            setTimeout(() => {
                bowl.classList.add('open');
                this.isRolling = false;
                btn.disabled = false;
                btn.innerText = "XỐC LẠI";
                
                const win = (result === this.bet);
                if(win) {
                    app.balance += this.amount;
                    status.innerText = `VỀ ${result.toUpperCase()} - BẠN THẮNG +1.000.000`;
                    status.style.color = '#00e676';
                } else {
                    app.balance -= this.amount;
                    status.innerText = `VỀ ${result.toUpperCase()} - BẠN THUA -1.000.000`;
                    status.style.color = '#d32f2f';
                }
                app.updateBalanceUI();
                app.addTransaction('Xóc Đĩa', this.bet.toUpperCase(), this.amount, win);

            }, 3000);
        }, 500);
    },
    reset: function() {
        this.bet = null;
        this.isRolling = false;
        document.getElementById('xd-bowl').classList.remove('open', 'shaking');
        document.querySelectorAll('#modal-xocdia .bet-option').forEach(e => e.classList.remove('active'));
        document.getElementById('xd-status').innerText = "Mời đặt cược...";
        document.getElementById('xd-status').style.color = "#fff";
    }
};

// --- GAME TÀI XỈU ---
const gameTX = {
    bet: null,
    isRolling: false,
    amount: 2000000,
    rotations: { 1:[0,0], 2:[-90,0], 3:[0,-90], 4:[0,90], 5:[90,0], 6:[0,180] },
    select: function(side) {
        if(this.isRolling) return;
        this.bet = side;
        document.getElementById('btn-tai').classList.remove('active');
        document.getElementById('btn-xiu').classList.remove('active');
        document.getElementById('btn-'+side).classList.add('active');
        document.getElementById('tx-status').innerText = `Cược ${side.toUpperCase()} - 2M`;
    },
    shake: function() {
        if(!this.bet) { alert("Chọn TÀI hoặc XỈU"); return; }
        if(this.isRolling) return;
        this.isRolling = true;

        const btn = document.getElementById('btn-tx-shake');
        const score = document.getElementById('tx-score');
        btn.disabled = true;
        score.style.opacity = 0;

        const d = [0,0,0].map(() => Math.ceil(Math.random() * 6));
        const total = d.reduce((a,b) => a+b, 0);
        const res = (total >= 11) ? 'tai' : 'xiu';

        d.forEach((val, idx) => {
            const el = document.getElementById('d'+(idx+1));
            const rot = this.rotations[val];
            const x = rot[0] + 720 + (Math.random()*20-10);
            const y = rot[1] + 720 + (Math.random()*20-10);
            el.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
        });

        setTimeout(() => {
            this.isRolling = false;
            btn.disabled = false;
            score.innerText = total;
            score.style.opacity = 1;
            
            const win = (res === this.bet);
            const status = document.getElementById('tx-status');
            if(win) {
                app.balance += this.amount;
                status.innerText = "BẠN THẮNG +2.000.000";
                status.style.color = '#00e676';
            } else {
                app.balance -= this.amount;
                status.innerText = "BẠN THUA -2.000.000";
                status.style.color = '#d32f2f';
            }
            app.updateBalanceUI();
            app.addTransaction('Tài Xỉu', this.bet.toUpperCase(), this.amount, win);
            
            const dot = document.createElement('div');
            dot.className = `dot ${res === 'tai' ? 't' : 'x'}`;
            document.getElementById('tx-history').appendChild(dot);

        }, 2000);
    },
    reset: function() {
        this.bet = null; this.isRolling = false;
        document.getElementById('btn-tai').classList.remove('active');
        document.getElementById('btn-xiu').classList.remove('active');
        document.getElementById('tx-score').style.opacity = 0;
        document.getElementById('tx-status').innerText = "Mời đặt cược";
        document.getElementById('tx-status').style.color = "#fff";
    }
};

// --- GAME BẦU CUA ---
const gameBC = {
    bets: [],
    isRolling: false,
    amount: 500000,
    faces: ['bau', 'cua', 'ca', 'gao', 'tiRepresentatives', 'baugaocautoi'],
    faceEmojis: { 'bau': '🍆', 'cua': '🦀', 'ca': '🐟', 'gao': '🍚', 'tiRepresentatives': '🐔', 'baugaocautoi': '🍻' },
    select: function(face) {
        if(this.isRolling) return;
        const idx = this.bets.indexOf(face);
        if(idx >= 0) this.bets.splice(idx, 1);
        else this.bets.push(face);
        
        document.querySelectorAll('#modal-baucua .bet-option').forEach(e => e.classList.remove('active'));
        this.bets.forEach(b => document.getElementById('bc-' + b).classList.add('active'));
        
        const status = document.getElementById('bc-status');
        if(this.bets.length === 0) {
            status.innerText = "Chưa chọn cửa nào";
            status.style.color = "#fff";
        } else {
            status.innerText = `Đã chọn: ${this.bets.join(', ').toUpperCase()} - Cược ${this.amount.toLocaleString('vi-VN')}`;
            status.style.color = 'gold';
        }
    },
    roll: function() {
        if(this.bets.length ===0) { alert("Vui lòng chọn ít nhất1 cửa!"); return; }
        if(this.isRolling) return;
        this.isRolling = true;
        
        const btn = document.getElementById('btn-bc-roll');
        const status = document.getElementById('bc-status');
        btn.disabled = true;
        btn.innerText = "ĐANG LẮC...";
        status.innerText = "Đang lắc xúc xắc...";
        
        // Animation
        for(let i =1; i <=3; i++) {
            document.getElementById('bc-dice-' + i).classList.add('rolling');
        }
        
        setTimeout(() => {
            // Random results
            const results = [];
            for(let i =1; i <=3; i++) {
                const face = this.faces[Math.floor(Math.random() * this.faces.length)];
                results.push(face);
                const dice = document.getElementById('bc-dice-' + i);
                if (dice) {
                    dice.classList.remove('rolling');
                    dice.setAttribute('data-face', face);
                    const faceEl = dice.querySelector('.dice-face');
                    const labelEl = dice.querySelector('.dice-label');
                    if(faceEl) faceEl.innerText = this.faceEmojis[face];
                    if(labelEl) labelEl.innerText = face.toUpperCase();
                }
            }
            
            // Total bet placed
            const totalBet = this.bets.length * this.amount;

            // Calculate wins
            let totalWin =0;
            this.bets.forEach(bet => {
                const count = results.filter(r => r === bet).length;
                if(count >0) {
                    totalWin += this.amount *2 * count; // x2 multiplier per match
                }
            });
            
            const win = totalWin >0;
            app.stats.total++;
            if(win) {
                app.balance += (totalWin - totalBet);
                app.stats.wins++;
                app.stats.totalWin += (totalWin - totalBet);
                status.innerText = `THẮNG! +${(totalWin - totalBet).toLocaleString('vi-VN')}`;
                status.style.color = '#00e676';
                app.addTransaction('Bầu Cua', this.bets.join(', '), totalBet, true);
            } else {
                app.balance -= totalBet;
                app.stats.losses++;
                app.stats.totalLose += totalBet;
                status.innerText = `THUA -${totalBet.toLocaleString('vi-VN')}`;
                status.style.color = '#d32f2f';
                app.addTransaction('Bầu Cua', this.bets.join(', '), totalBet, false);
            }
            
            app.updateBalanceUI();
            this.isRolling = false;
            btn.disabled = false;
            btn.innerText = "LẮC LẠI";
        },2000);
    },
    reset: function() {
        this.bets = [];
        this.isRolling = false;
        document.getElementById('bc-status').innerText = "Chưa chọn cửa nào";
        document.querySelectorAll('#modal-baucua .bet-option').forEach(e => e.classList.remove('active'));
        for(let i =1; i <=3; i++) {
            const dice = document.getElementById('bc-dice-' + i);
            if (dice) {
                dice.classList.remove('rolling');
                dice.removeAttribute('data-face');
                const faceEl = dice.querySelector('.dice-face');
                const labelEl = dice.querySelector('.dice-label');
                if(faceEl) faceEl.innerText = '';
                if(labelEl) labelEl.innerText = '';
            }
        }
    }
};

// Chat widget controls
document.addEventListener('DOMContentLoaded', () => {
 const chatToggle = document.getElementById('chat-toggle-btn');
 const chatWidget = document.getElementById('chat-widget');
 const chatClose = document.getElementById('chat-close');
 const chatBox = document.getElementById('chatBox');

 if(chatToggle) chatToggle.addEventListener('click', () => {
 if(chatWidget.style.display === 'none' || !chatWidget.style.display) chatWidget.style.display = 'block';
 else chatWidget.style.display = 'none';
 });
 if(chatClose) chatClose.addEventListener('click', () => chatWidget.style.display = 'none');

 // make sure send button works even if replaced
 const sendBtn = document.querySelector('#chat-widget button[onclick]') || null;
 // if existing app.sendChat is present it will be used
});

// Replace app.openGame to load external HTML files in the modal instead of embedding all UIs
const originalOpenGame = app.openGame;
app.openGame = function(id, extra) {
 // Map id to separate game files under games/
 const map = {
 'xocdia': 'games/xocdia.html',
 'taixiu': 'games/taixiu.html',
 'baucua': 'games/baucua.html',
 'banca': 'games/banca.html',
 'slot': 'games/slot.html'
 };
 const file = map[id];
 if(!file) return originalOpenGame.call(app, id, extra);

 const modal = document.getElementById('game-modal');
 const body = document.getElementById('game-modal-body');
 const title = document.getElementById('game-modal-title');
 modal.classList.add('active');
 title.innerText = (id || 'Game').toUpperCase() + (extra ? ' - ' + extra.toUpperCase() : '');
 body.innerHTML = '<div style="color:#ccc; text-align:center; padding-top:60px;">Đang tải game...</div>';

 fetch(file).then(r => {
 if(!r.ok) throw new Error('Không tải được file game');
 return r.text();
 }).then(html => {
 body.innerHTML = html;
 }).catch(err => {
 body.innerHTML = `<div style="padding:20px;color:#f88">Lỗi khi tải game: ${err.message}</div>`;
 });
};

// Close game modal
document.addEventListener('click', (e) => {
 if(e.target && e.target.id === 'game-modal-close') {
 document.getElementById('game-modal').classList.remove('active');
 document.getElementById('game-modal-body').innerHTML = '';
 }
});

// Override app.sendChat to append to small widget
app.sendChat = function() {
 const inp = document.getElementById('chatInput');
 if(!inp || !inp.value) return;
 const chatBox = document.getElementById('chatBox');
 const line = document.createElement('div');
 line.className = 'chat-msg';
 line.innerHTML = `<span class="chat-user vip" style="color:var(--gold-primary)">Tôi:</span> ${inp.value}`;
 chatBox.appendChild(line);
 chatBox.scrollTop = chatBox.scrollHeight;
 inp.value = '';
};