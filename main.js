import kaplay from "kaplay";
import "kaplay/global";

kaplay({ topMostOnlyActivate: true });

debug.inspect = true;

scene("setings_targets", () => {
    const setings_targets = add([
        rect(400, height() - 400),
        pos(center()),
        color(BLACK),
        opacity(0.85),
        anchor("center"),
    ]);

    setings_targets.add([
        text("Time:"),
        pos(0, -126),
        textInput(),
        anchor("center"),
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
        go("game");
    });
});

scene("game", () => {
    let count_hit = 0;
    let tochnost = 100;
    let mistakes = 0;
    let clicks = 0;
    let time = 10;
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

    onUpdate("target", (targets) => {
        time -= dt();
        if(time <= 0)
            go("game_over", 10, tochnost, count_hit, mistakes);
        time_text.text = `Time:${Math.round(time)}`;

    });
    onResize(() => {
        promah.width = width();
        promah.height = height();
        promah.pos = center();
        time_text.pos = vec2(width() - 10, 10);
    });
    onKeyDown("t", () => {
        go("game_over", 10, tochnost, count_hit, mistakes);
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
        text(`Time:${time}`),
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