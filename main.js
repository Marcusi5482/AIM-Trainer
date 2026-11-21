import kaplay from "https://unpkg.com/kaplay@4000.0.0-alpha.27.1/dist/kaplay.mjs";

kaplay({ topMostOnlyActivate: true });

loadRoot("./");
loadSprite("checkmark", "./sprites/checkmark.png");
loadSprite("arrow left", "./sprites/arrow_left.png");

const data = {
    time: 10,
    targets: 1,
    speed: 0,
    speed_twister_x: center().x,
    speed_opacity: 0,
    reduce: 0,
    reduce_twister_x: center().x + 41,
    reduce_opacity: 0,
};
scene("menu", () => {
    setBackground(WHITE);
    const menu = add([
        rect(400, 280),
        pos(center()),
        color(BLACK),
        opacity(0.85),
        anchor("center"),
    ]);
    
    menu.add([
        text("AIM-Trainer"),
        pos(0, -109),
        anchor("center"),
    ]).add([
        rect(menu.width, 4),
        pos(0, 30),
        opacity(0.85),
        anchor("center"),
    ]);
    menu.add([
        rect(290, 50),
        pos(0, -10),
        area(),
        anchor("center"),
        "button_standart_game"
    ]).add([
        text("Standart Game"),
        color(BLACK),
        anchor("center"),
    ]);
    menu.add([
        rect(290, 50),
        pos(0, 80),
        area(),
        anchor("center"),
        "button_hardcore_game"
    ]).add([
        text("Hardcore Game"),
        color(BLACK),
        anchor("center"),
    ]);
    onClick("button_standart_game", () => go("setings_targets"));
    onClick("button_hardcore_game", () => go("hardcor_game", 10, 1, 1, 0));
    onResize(() => menu.pos = center());
});

scene("setings_targets", () => {
    setBackground(WHITE);
    let track_width = 200;
    let track_width_reduce = 160;
    let speed_number = data.speed;
    let reduce_number = data.reduce;
    const setings_targets = add([
        rect(500, 310),
        pos(center()),
        color(BLACK),
        opacity(0.85),
        anchor("center"),
    ]);
    setings_targets.add([
        sprite("arrow left"),
        pos(-205, -120),
        scale(5),
        anchor("center"),
        area({
            scale: vec2(0.4, 0.4),
            offset: vec2(-2, 0),
        }),
        "arrow_left",
    ]);

    const time_text = setings_targets.add([
        pos(0, -116),
        text("Time:"),
        anchor("right"),
    ]);
    const time_input = time_text.add([
        rect(90, 40, { fill: false }),
        pos(2, 0),
        opacity(0.85),
        outline(2.8, WHITE),
        anchor("left"),
        area(),
    ]);
    const time_text_input = time_input.add([
        text(`${data.time}`),
        pos(1, 0),
        anchor("left"),
        {type: false},
    ]);

    const targets_text = setings_targets.add([
        pos(0, -70),
        text("Targets:"),
        anchor("right"),
    ]);
    const targets_input = targets_text.add([
        rect(90, 40, { fill: false }),
        pos(2, 0),
        opacity(0.85),
        outline(2.8, WHITE),
        anchor("left"),
        area(),
    ]);
    const targets_text_input = targets_input.add([
        text(`${data.targets}`),
        pos(1, 0),
        anchor("left"),
        {type: false},
    ]);
    const move = setings_targets.add([
        pos(-130, -25),
        text("Move"),
        anchor("center"),
    ]);
    const move_mark_hitbox = move.add([
        rect(40, 40, { fill: false }),
        pos(55, 0),
        opacity(0.85),
        outline(2.8, WHITE),
        anchor("left"),
        area(),
    ]);
    const move_mark = move_mark_hitbox.add([
        sprite("checkmark"),
        pos(18, 9),
        opacity(data.speed_opacity),
        scale(2.9),
        anchor("center"),
    ]);
    const strip = add([
        rect(track_width, 10),
        pos(center().x + 80, center().y - 25),
        opacity(data.speed_opacity),
        anchor("center"),
    ]);
    const twister = add([
        rect(28, 28),
        pos(data.speed_twister_x, center().y - 25),
        opacity(data.speed_opacity),
        anchor("center"),
        area(),
    ]);
    const speed_text = setings_targets.add([
        text(`${speed_number}`),
        pos(205, move.pos.y),
        opacity(data.speed_opacity),
        anchor("left"),
    ]);
    const reduce = setings_targets.add([
        text("Reduce"),
        pos(-43, 23),
        anchor("right"),
    ]);
    const reduce_mark_hitbox = reduce.add([
        rect(40, 40, { fill: false }),
        pos(10, 0),
        opacity(0.85),
        outline(2.8, WHITE),
        anchor("left"),
        area(),
    ]);
    const reduce_mark = reduce_mark_hitbox.add([
        sprite("checkmark"),
        pos(18, 9),
        opacity(data.reduce_opacity),
        scale(2.9),
        anchor("center"),
    ]);
    const strip_reduce = add([
        rect(track_width_reduce, 10),
        pos(center().x + 100, center().y + 22),
        opacity(data.reduce_opacity),
        anchor("center"),
    ]);
    const twister_reduce = add([
        rect(28, 28),
        pos(data.reduce_twister_x, strip_reduce.pos.y),
        opacity(data.reduce_opacity),
        anchor("center"),
        area(),
    ]);
    const text_reduce = setings_targets.add([
        text(`${reduce_number}`),
        pos(205, reduce.pos.y),
        opacity(data.reduce_opacity),
        anchor("left"),
    ]);
    const button_play = setings_targets.add([
        rect(290, 50),
        pos(0, 112),
        area(),
        anchor("center"),
        "button_play",
    ]).add([
        text("Play"),
        color(BLACK),
        anchor("center"),
    ]);
    button_play.add([
        rect(setings_targets.width, 4),
        pos(0, -40),
        opacity(0.85),
        anchor("bot"),
    ]);

    onClick("button_play", () => {
        data.time = Number(time_text_input.text);
        data.targets = Number(targets_text_input.text);
        data.speed = speed_number;
        data.speed_opacity = move_mark.opacity;
        data.speed_twister_x = twister.pos.x;
        data.reduce = reduce_number;
        data.reduce_opacity = reduce_mark.opacity;
        data.reduce_twister_x = twister_reduce.pos.x;
        if(move_mark.opacity == 0)
            speed_number = 0;
        if(reduce_mark.opacity == 0)
            reduce_number = 0;
        go("game", Number(time_text_input.text), Number(targets_text_input.text), speed_number, reduce_number);
    });
    time_input.onClick(() => {
        time_text_input.type = true;
        targets_text_input.type = false;
    });
    targets_input.onClick(() => {
        targets_text_input.type = true
        time_text_input.type = false;
    });
    move_mark_hitbox.onClick(() => {
        switch(move_mark.opacity)
        {
            case 0:
                move_mark.opacity = 1;
                strip.opacity = 1;
                twister.opacity = 1;
                speed_text.opacity = 1;
                break;
            case 1:
                move_mark.opacity = 0;
                strip.opacity = 0;
                twister.opacity = 0;
                speed_text.opacity = 0;
                break;
        }
    });
    reduce_mark_hitbox.onClick(() => {
        switch(reduce_mark.opacity)
        {
            case 0:
                reduce_mark.opacity = 1;
                strip_reduce.opacity = 1;
                twister_reduce.opacity = 1;
                text_reduce.opacity = 1;
                break;
            case 1:
                reduce_mark.opacity = 0;
                strip_reduce.opacity = 0;
                twister_reduce.opacity = 0;
                text_reduce.opacity = 0;
                break;
        }
    });
    onClick("arrow_left", () => go("menu"));
    let dragging = false;
    twister.onMousePress(() => {
        if(twister.isHovering() && strip.opacity == 1 && twister.opacity == 1 && speed_text.opacity == 1)
            dragging = true;
        else
            dragging = false;
    });
    onMouseRelease(() => {
        dragging = false;
    });
    onUpdate(() => {
        if (dragging) {
            const leftEdge = strip.pos.x - track_width / 2;
            const rightEdge = strip.pos.x + track_width / 2;
            twister.pos = vec2(clamp(mousePos().x, leftEdge, rightEdge), twister.pos.y);
            speed_number = Math.round(map(twister.pos.x, leftEdge, rightEdge, 1, 10));
            speed_text.text = `${speed_number}`;
        }
    });
    let dragging_reduce = false
    twister_reduce.onMousePress(() => {
        if(twister_reduce.isHovering() && strip_reduce.opacity == 1 && twister_reduce.opacity == 1)
            dragging_reduce = true;
        else
            dragging_reduce = false;
    });
    onMouseRelease(() => {
        dragging_reduce = false;
    });
    onUpdate(() => {
        if (dragging_reduce) {
            const leftEdge = strip_reduce.pos.x - track_width_reduce / 2;
            const rightEdge = strip_reduce.pos.x + track_width_reduce / 2;
            twister_reduce.pos = vec2(clamp(mousePos().x, leftEdge, rightEdge), twister_reduce.pos.y);
            reduce_number = Math.round(map(twister_reduce.pos.x, leftEdge, rightEdge, 1, 10));
            text_reduce.text = `${reduce_number}`;
        }
    });
    onCharInput((ch) => {
        if(ch >= "0" && ch <= "9" && time_text_input.text.length < 4 && time_text_input.type == true)
                time_text_input.text += ch;
        else if(ch >= "0" && ch <= "9" && targets_text_input.text.length < 4 && targets_text_input.type == true)
                targets_text_input.text += ch;
    });
    onKeyPress("backspace", () => {
        if(time_text_input.type == true && time_text_input.text.length > 0) {
            time_text_input.text = time_text_input.text.substring(0, time_text_input.text.length - 1);
        } else if(targets_text_input.type == true && targets_text_input.text.length > 0) {
            targets_text_input.text = targets_text_input.text.substring(0, targets_text_input.text.length - 1);
        }
    });
    onResize(() => {
        setings_targets.pos = center();
        strip.pos = vec2(center().x + 80, strip.pos.y);
        twister.pos = vec2(center().x, twister.pos.y);
        strip_reduce.pos = vec2(center().x + 100, strip_reduce.pos.y);
        twister_reduce.pos = vec2(center().x + 41, twister_reduce.pos.y);
    });    
});

scene("game", (time, targets, speed, reduce) => {
    const max_time = time;
    let count_hit = 0;
    let tochnost = 0;
    let mistakes = 0;
    let clicks = 0;
    const tochnost_text = add([
        text(`Accuracy:${tochnost}`),
        color(BLACK),
        pos(10, 10),
        z(20),
    ]);
    
    const time_text = add([
        text(`Time:${time}`),
        color(BLACK),
        pos(width() - 10, 10),
        anchor("topright"),
        z(20),
    ]);

    const promah = add([
        pos(center()),
        color(WHITE),
        rect(width(), height()),
        anchor("center"),
        area(),
    ]);

    for(let i = 0; i < targets; i++)
        spawn_target(speed, reduce);

    onClick("target", (target) => {
        count_hit++;
        clicks++;
        tochnost = Math.round((count_hit / clicks) * 100);
        tochnost_text.text = `Accuracy:${tochnost}`;
        destroy(target);
    });

    onDestroy("target", () => {
        spawn_target(speed, reduce);
    });

    promah.onClick(() => {
        clicks++;
        mistakes++;
        tochnost = Math.round((count_hit / clicks) * 100);
        if(tochnost < 0)
            tochnost = 0;
        tochnost_text.text = `Accuracy:${tochnost}`;
    });

    onUpdate(() => {
        time -= dt();
        if(time <= 0)
            go("game_over", max_time, tochnost, count_hit, mistakes);
        time_text.text = `Time:${Math.round(time)}`;

    });
    onResize(() => {
        promah.width = width();
        promah.height = height();
        promah.pos = center();
        time_text.pos = vec2(width() - 10, 10);
    });
});
let max_score = 0;
scene("hardcor_game", (time, targets, speed, reduce) => {
    const max_time = time;
    let score = 0;
    let mistakes = 0;
    const tochnost_text = add([
        text(`Score:${score}`),
        color(BLACK),
        pos(10, 10),
        z(20),
    ]);
    
    const time_text = add([
        text(`Time:${time}`),
        color(BLACK),
        pos(width() - 10, 10),
        anchor("topright"),
        z(20),
    ]);

    const promah = add([
        pos(center()),
        color(WHITE),
        rect(width(), height()),
        anchor("center"),
        area(),
    ]);

    for(let i = 0; i < targets; i++)
        spawn_target_hardcore(speed, reduce);

    onClick("target", (target) => {
        score++;
        time = 10;
        if(score > max_score)
            max_score = score;
        tochnost_text.text = `Score:${score}`;
        destroy(target);
    });

    onDestroy("target", () => {
        speed +=1
        spawn_target_hardcore(speed);
    });

    promah.onClick(() => go("game_over_hardcore", max_score, score));

    onUpdate(() => {
        time -= dt();
        if(time <= 0)
            go("game_over_hardcore", max_score, score);
        time_text.text = `Time:${Math.round(time)}`;

    });
    onResize(() => {
        promah.width = width();
        promah.height = height();
        promah.pos = center();
        time_text.pos = vec2(width() - 10, 10);
    });
});

scene("game_over", (time, accuracy, hit, misseds) => {
    setBackground(WHITE);
    const game_over = add([
        rect(400, 300),
        pos(center()),
        color(BLACK),
        opacity(0.85),
        anchor("center"),
    ]);

    const game_over_text = game_over.add([
        text("Game Over"),
        pos(0, -126),
        anchor("center"),
    ]).add([
        rect(400, 4),
        pos(0, 20),
        opacity(0.85),
        anchor("top"),
    ]);
    game_over_text.add([
        text(`Time:${Math.round(time)}`),
        pos(0, 29),
        anchor("center"),
    ]);
    game_over_text.add([
        text(`Accuracy:${accuracy}`),
        pos(0, 64),
        anchor("center"),
    ]);
    game_over_text.add([
        text(`Hit:${hit}`),
        pos(0, 103),
        anchor("center"),
    ]);
    game_over_text.add([
        text(`Misseds:${misseds}`),
        pos(0, 140),
        anchor("center"),
    ]);
    const button_ok = game_over.add([
        rect(290, 50),
        pos(0, 107),
        area(),
        anchor("center"),
        "button_ok",
    ]).add([
        text("ok"),
        color(BLACK),
        anchor("center"),
    ]);
    button_ok.add([
        rect(400, 4),
        pos(0, -40),
        opacity(0.85),
        anchor("bot"),
    ]);
    onClick("button_ok", () => {
        go("setings_targets");
    });
    onResize(() => {
        game_over.pos = center();
    })
});

scene("game_over_hardcore", (max_score, score) => {
    const game_over = add([
        rect(400, 300),
        pos(center()),
        color(BLACK),
        opacity(0.85),
        anchor("center"),
    ]);

    game_over.add([
        text("Game Over"),
        pos(0, -128),
        anchor("center"),
    ]).add([
        rect(400, 4),
        pos(0, 20),
        opacity(0.85),
        anchor("top"),
    ]);

    game_over.add([
        text(`Max Score:${max_score}`),
        pos(0, -77),
        anchor("center"),
    ]);
    game_over.add([
        text(`Score:${score}`),
        pos(0, -38),
        anchor("center"),
    ]);
    game_over.add([
        rect(290, 50),
        pos(0, 25),
        area(),
        anchor("center"),
        "button_menu",
    ]).add([
        text("Menu"),
        color(BLACK),
        anchor("center"),
    ]);
    game_over.add([
        rect(290, 50),
        pos(0, 100),
        area(),
        anchor("center"),
        "button_restart_game",
    ]).add([
        text("Restart Game"),
        color(BLACK),
        anchor("center"),
    ]);
    onClick("button_menu", () => go("menu"));
    onClick("button_restart_game", () => go("hardcor_game", 10, 1, 1, 0));
    onResize(() => {
        game_over.pos = vec2(center().x, game_over.pos.y);
    });
});

go("menu");

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawn_target(speed, reduce)
{
    const target_pos = vec2(rand(50, width() - 50), rand(50, height() - 50));
    
    const target = add([
        pos(target_pos),
        color(BLACK),
        circle(45),
        anchor("center"),
        area(),
        "target",
        {
            old_pos: target_pos,
            speed: 200 * speed / 2,
        },
    ]);
    const white_target = target.add([
        color(WHITE),
        circle(30),
    ]);
    const red_target = target.add([
        color(RED),
        circle(15),
    ]);

    target.onUpdate(() => {
        if(target.old_pos.eq(target.pos))
            target.old_pos = vec2(vec2(rand(50, width() - 50), rand(50, height() - 50)));
        let num = 10
        target.radius -= reduce / num;
        white_target.radius -= reduce / num;
        red_target.radius -= reduce / num;
        if(red_target.radius <= 3)
            destroy(red_target);
        if(white_target.radius <= 3)
            destroy(white_target);
        if(target.radius <= 3)
            destroy(target);
        target.moveTo(target.old_pos, target.speed);
    });

    return target;
}

function spawn_target_hardcore(speed)
{
    const target_pos = vec2(rand(50, width() - 50), rand(50, height() - 50));
    
    const target = add([
        pos(target_pos),
        color(BLACK),
        circle(45),
        anchor("center"),
        area(),
        "target",
        {
            old_pos: target_pos,
            speed: 200 * speed / 2,
        },
    ]);
    const white_target = target.add([
        color(WHITE),
        circle(30),
    ]);
    const red_target = target.add([
        color(RED),
        circle(15),
    ]);

    target.onUpdate(() => {
        if(target.old_pos.eq(target.pos))
            target.old_pos = vec2(vec2(rand(50, width() - 50), rand(50, height() - 50)));
        target.moveTo(target.old_pos, target.speed);
    });

    return target;
}