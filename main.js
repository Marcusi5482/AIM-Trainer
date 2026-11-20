import kaplay from "kaplay";
import "kaplay/global";

kaplay({ topMostOnlyActivate: true });

loadRoot("./");
loadSprite("checkmark", "./sprites/checkmark.png");

// debug.inspect = true;

scene("setings_targets", () => {
    let track_width = 200;
    let speed_number = 1;
    const setings_targets = add([
        rect(400, height() - 400),
        pos(center()),
        color(BLACK),
        opacity(0.85),
        anchor("center"),
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
        text(""),
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
        text(""),
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
        opacity(0),
        scale(2.9),
        anchor("center"),
    ]);
    const strip = add([
        rect(track_width, 10),
        pos(center().x + 80, center().y - 25),
        anchor("center"),
    ]);
    const twister = add([
        rect(28, 28),
        pos(center().x, center().y - 25),
        anchor("center"),
        area(),
    ]);
    const speed_text = setings_targets.add([
        text(`${speed_number}`),
        pos(150, -60),
        anchor("left"),
    ]);
    const button_play = setings_targets.add([
        rect(290, 50),
        pos(0, 107),
        area(),
        anchor("center"),
        "button_play",
    ]).add([
        text("Play"),
        color(BLACK),
        anchor("center"),
    ]);
    button_play.add([
        rect(400, 4),
        pos(0, -40),
        opacity(0.85),
        anchor("bot"),
    ]);

    onClick("button_play", () => {
        go("game", Number(time_text_input.text), Number(targets_text_input.text));
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
                break;
            case 1:
                move_mark.opacity = 0;
                break;
        }
    });
    let dragging = false;
    twister.onMousePress(() => {
        if(twister.isHovering())
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
    
});

scene("game", (time, targets) => {
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
        spawn_target();

    onClick("target", (target) => {
        count_hit++;
        clicks++;
        tochnost = Math.round((count_hit / clicks) * 100);
        tochnost_text.text = `Accuracy:${tochnost}`;
        destroy(target);
        spawn_target();
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

scene("game_over", (time, accuracy, hit, misseds) => {
    setBackground(WHITE);
    const game_over = add([
        rect(400, height() - 400),
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
});

go("setings_targets");

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawn_target()
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
            speed: 200,
        },
    ]);
    target.add([
        color(WHITE),
        circle(30),
    ]);
    target.add([
        color(RED),
        circle(15),
    ]);

    target.onUpdate(() => {
        if(target.old_pos.eq(target.pos))
        {
            target.old_pos = vec2(vec2(rand(50, width() - 50), rand(50, height() - 50)));
        }
        target.moveTo(target.old_pos, target.speed);
    });

    return target;
}