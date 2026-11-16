"use client";

import {
  Check,
  Copy,
  Eye,
  MessageSquare,
  Pause,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/stageshow/kit/controls/Button";
import type { Act } from "@/stageshow/kit/act";
import { between, box, contains, inset, type Point, type Rect } from "@/stageshow/kit/measure";
import { States } from "@/stageshow/kit/motion/States";
import { Stage } from "@/stageshow/kit/stage";
import { Bar, Text, Window } from "@/stageshow/kit/window";
import "./hero.css";

// 홈페이지 히어로: 대시보드에 피드백을 세 가지로 남기고, 메모 창에 붙인다.

type Tone = "blue" | "green" | "orange";
type Marker = { at: Point; show: boolean };

type Scene = {
  toolbar: boolean;
  highlight: boolean;
  popup: { show: boolean; header: string; at: Point; tone: Tone };
  typed: string;
  drag: Rect | null;
  dragging: boolean;
  area: { r: Rect; show: boolean };
  picked: string[];
  selection: number | null;
  m3: Marker;
  m4: Marker;
  m5: Marker;
  copied: boolean;
  terminal: boolean;
  pasted: string;
};

const hidden = (marker: Marker): Marker => ({ ...marker, show: false });

const initial: Scene = {
  toolbar: false,
  highlight: false,
  popup: { show: false, header: "", at: { x: 0, y: 0 }, tone: "blue" },
  typed: "",
  drag: null,
  dragging: false,
  area: { r: { x: 0, y: 0, width: 0, height: 0 }, show: false },
  picked: [],
  selection: null,
  m3: { at: { x: 0, y: 0 }, show: false },
  m4: { at: { x: 0, y: 0 }, show: false },
  m5: { at: { x: 0, y: 0 }, show: false },
  copied: false,
  terminal: false,
  pasted: "",
};

const TITLE = "이번 주 실험";
const OUTPUT = `## 화면 피드백

보내기 버튼: 기본 스타일
사이드 아이콘: 호버
대시보드 제목: 더 크게`;

const REST = { wide: { x: 432, y: 212 }, compact: { x: 280, y: 270 } };
const POSTER: Scene = {
  ...initial,
  toolbar: true,
  copied: true,
  terminal: true,
  pasted: OUTPUT,
};

const annotate = async (
  act: Act<Scene>,
  header: string,
  tone: Tone,
  at: Point,
  text: string,
) => {
  const width = act.layout === "compact" ? 358 : 720;
  const gutter = act.layout === "compact" ? 16 : 32;
  const half = 100;
  const placed = {
    x: Math.max(half + gutter, Math.min(width - half - gutter, at.x)),
    y: at.y,
  };
  await act.set((scene) => ({
    popup: { ...scene.popup, show: true, header, at: placed, tone },
    typed: "",
  }));
  await act.wait(300);
  await act.type("typed", text);
  await act.wait(300);
  await act.click({ at: "add", x: 0.88, y: 0.72 });
  await act.set((scene) => ({ popup: { ...scene.popup, show: false } }));
  await act.wait(200);
};

const script = async (act: Act<Scene>) => {
  await act.wait(600);

  await act.move("toolbar");
  await act.wait(300);
  await act.click();
  await act.set({ toolbar: true });
  await act.wait(400);
  await act.wait(200);

  await act.move("export");
  await act.set({ highlight: true });
  await act.wait(400);
  await act.click();
  await act.set({ highlight: false });
  await act.wait(100);
  const button = act.rect("export");
  await annotate(
    act,
    "보내기 버튼",
    "blue",
    { x: button.x + button.width / 2 - 80, y: button.y + button.height + 10 },
    "기본 스타일로",
  );
  await act.set({ m3: { at: act.center("export"), show: true } });
  await act.wait(600);

  const icons = act.rect("icons");
  const from = { x: icons.x + icons.width + 2, y: icons.y + icons.height + 2 };
  const to = { x: icons.x - 2, y: icons.y - 2 };
  await act.move(from);
  await act.wait(150);
  await act.drag(to, (at) => {
    const drag = between(from, at);
    const picked = ["icon-0", "icon-1", "icon-2"].filter((name) =>
      contains(drag, act.rect(name)),
    );
    act.put({ drag, picked, dragging: true });
  }, { cursor: "preserve" });
  await act.wait(200);
  await act.set({
    dragging: false,
    picked: [],
    area: { r: between(from, to), show: true },
  });
  await annotate(
    act,
    "사이드 아이콘",
    "green",
    { x: to.x + 110, y: (from.y + to.y) / 2 - 40 },
    "호버를 추가",
  );
  await act.set({ m4: { at: { x: from.x, y: to.y }, show: true } });
  await act.wait(400);

  const title = act.rect("title");
  const y = title.y + title.height / 2;
  await act.move({ x: title.x, y });
  await act.wait(150);
  await act.drag({ x: title.x + title.width, y }, (at) =>
    act.put({ selection: act.caret("title", at) }),
  );
  await act.wait(200);
  await annotate(
    act,
    `"${TITLE}"`,
    "orange",
    {
      x: Math.max(100, title.x + title.width / 2),
      y: title.y + title.height + 7,
    },
    "더 크게",
  );
  await act.set({
    selection: null,
    m5: { at: { x: title.x + title.width + 2, y }, show: true },
  });
  await act.wait(400);

  await act.move("copy");
  await act.wait(400);
  await act.click();
  await act.set({ copied: true });
  await act.wait(400);
  await act.set({ terminal: true });
  await act.wait(600);
  await act.click("terminal-input");
  await act.key("cmd+v");
  await act.set({ pasted: OUTPUT });
  await act.move("rest");
  await act.wait(2000);

  await act.set((scene) => ({
    ...initial,
    m3: hidden(scene.m3),
    m4: hidden(scene.m4),
    m5: hidden(scene.m5),
    area: { ...scene.area, show: false },
    pasted: scene.pasted,
    popup: scene.popup,
  }));
  await act.move("rest");
  await act.wait(400);
  await act.set({ ...initial });
};

const glyph = (Glyph: typeof Copy, size: number) => (
  <Glyph size={size} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
);

export default function HeroDemo() {
  return (
    <Stage
      width={720}
      height={340}
      compact={{ below: 600, width: 358, height: 336 }}
      initial={initial}
      poster={POSTER}
      script={script}
      cursor={{ at: REST }}
      className="hd"
    >
      {(scene, rect, layout) => (
        <>
          <Window
            url="lab.local/week"
            className="hd-browser"
            data-cursor="pointer"
            receded={scene.terminal}
          >
            <div className="hd-content">
              <aside className="hd-sidebar">
                <Bar className="hd-sidebar-logo" w={20} h={20} r={5} tone={4} />
                <div className="hd-sidebar-icons" data-target="icons">
                  {[0, 1, 2].map((index) => (
                    <Bar
                      key={index}
                      data-target={`icon-${index}`}
                      className="hd-sidebar-icon"
                      w={16}
                      h={16}
                      r={4}
                      tone={index === 1 ? 5 : 3}
                      data-selected={scene.picked.includes(`icon-${index}`)}
                    />
                  ))}
                </div>
                <div className="hd-sidebar-bottom">
                  <Bar w={16} h={16} r={8} tone={3} />
                </div>
              </aside>

              <main className="hd-main">
                <div className="hd-header">
                  <div className="hd-header-left">
                    <Bar w={18} h={18} r={5} tone={4} />
                    <span
                      className="hd-title"
                      data-target="title"
                      data-cursor="ibeam"
                    >
                      {scene.selection == null ? (
                        TITLE
                      ) : (
                        <>
                          <span className="hd-selection-text">
                            {TITLE.slice(0, scene.selection)}
                          </span>
                          {TITLE.slice(scene.selection)}
                        </>
                      )}
                    </span>
                  </div>
                  <Button
                    data-target="export"
                    data-cursor="pointer"
                    size="small"
                    variant="secondary"
                  >
                    보내기
                  </Button>
                </div>

                <div className="hd-metrics">
                  {[
                    [45, 50],
                    [55, 65],
                    [38, 40],
                  ].map(([label, value], index) => (
                    <div
                      key={index}
                      className="hd-card"
                      data-target={`metric-${index}`}
                    >
                      <Bar w={label} h={5} tone={3} style={{ marginBottom: 8 }} />
                      <Bar w={value} h={18} r={3} tone={4} />
                    </div>
                  ))}
                </div>

                <div className="hd-table" data-crop>
                  <div className="hd-row head">
                    <Bar w={60} tone={4} />
                    <Bar w={45} tone={4} />
                    <Bar w={40} tone={4} />
                  </div>
                  {[
                    ["이미지", "이번 주", 48],
                    ["캐시", "지난 주", 42],
                    [62, 38, 48],
                  ].map(([name, when, pill], index) => (
                    <div
                      key={index}
                      className="hd-row"
                      data-target={`row-${index}`}
                    >
                      {typeof name === "string" ? (
                        <Text className="hd-cell">{name}</Text>
                      ) : (
                        <Bar w={name} h={7} tone={2} />
                      )}
                      {typeof when === "string" ? (
                        <Text className="hd-cell hd-cell--faint">{when}</Text>
                      ) : (
                        <Bar w={when} h={7} tone={2} />
                      )}
                      <Bar w={pill as number} h={18} r={9} tone={1} />
                    </div>
                  ))}
                </div>

                <Toolbar open={scene.toolbar} copied={scene.copied} />
              </main>
            </div>
          </Window>

          <div
            className="hd-highlight"
            data-show={scene.highlight}
            style={box(inset(rect("export"), 4))}
          />
          <div
            className="hd-dragbox"
            data-show={scene.dragging || undefined}
            style={scene.drag ? box(scene.drag) : undefined}
          />
          <div
            className="hd-area"
            data-show={scene.area.show}
            style={box(scene.area.r)}
          />
          {rect("metric-0").width > 0 && (
            <div
              className="hd-marker"
              data-show
              style={{
                left: rect("metric-0").x + 28,
                top: rect("metric-0").y + 14,
              }}
            >
              1
            </div>
          )}
          {rect("row-0").width > 0 && (
            <div
              className="hd-marker"
              data-show
              style={{
                left: rect("row-0").x + 140,
                top: rect("row-0").y + 10,
              }}
            >
              2
            </div>
          )}
          <div
            className="hd-marker"
            data-show={scene.m3.show}
            style={{ left: scene.m3.at.x, top: scene.m3.at.y }}
          >
            3
          </div>
          <div
            className="hd-marker"
            data-tone="green"
            data-show={scene.m4.show}
            style={{ left: scene.m4.at.x, top: scene.m4.at.y }}
          >
            4
          </div>
          <div
            className="hd-marker"
            data-tone="orange"
            data-show={scene.m5.show}
            style={{ left: scene.m5.at.x, top: scene.m5.at.y }}
          >
            5
          </div>

          <div
            className="hd-popup"
            data-show={scene.popup.show}
            data-tone={scene.popup.tone}
            style={{ left: scene.popup.at.x, top: scene.popup.at.y }}
          >
            <div className="hd-popup-header">{scene.popup.header}</div>
            <div className="hd-popup-input" data-cursor="ibeam">
              {scene.typed}
              <span className="hd-caret" style={{ opacity: 0.4 }}>
                |
              </span>
            </div>
            <div className="hd-popup-actions">
              <div className="hd-popup-btn">취소</div>
              <div
                className="hd-popup-btn submit"
                data-target="add"
                data-cursor="hand"
              >
                추가
              </div>
            </div>
          </div>

          <Window className="hd-terminal" data-show={scene.terminal}>
            <div
              className="hd-terminal-body"
              data-target="terminal-input"
              data-cursor="ibeam"
              data-snap
            >
              <div className="hd-terminal-name">화면 메모</div>
              <div className="hd-terminal-prompt">피드백을 붙여 넣으세요.</div>
              {scene.pasted}
              <span style={{ opacity: 0.4 }}>█</span>
            </div>
          </Window>
          <span
            data-target="rest"
            style={{
              position: "absolute",
              left: REST[layout].x,
              top: REST[layout].y,
            }}
          />
        </>
      )}
    </Stage>
  );
}

function Toolbar({ open, copied }: { open: boolean; copied: boolean }) {
  return (
    <div
      className="hd-toolbar"
      data-target="toolbar"
      data-cursor="hand"
      data-open={open}
    >
      <div className="hd-toolbar-icon">{glyph(MessageSquare, 20)}</div>
      <div className="hd-toolbar-buttons">
        <div className="hd-toolbar-btn">{glyph(Pause, 16)}</div>
        <div className="hd-toolbar-btn">{glyph(Eye, 16)}</div>
        <div
          className="hd-toolbar-btn"
          data-target="copy"
          data-cursor="hand"
          data-active={copied}
        >
          <States
            value={copied ? "check" : "copy"}
            states={{
              copy: glyph(Copy, 16),
              check: glyph(Check, 16),
            }}
          />
        </div>
        <div className="hd-toolbar-btn">{glyph(Trash2, 16)}</div>
        <div className="hd-toolbar-btn">{glyph(Settings, 16)}</div>
        <div className="hd-toolbar-divider" />
        <div className="hd-toolbar-btn">{glyph(X, 16)}</div>
      </div>
    </div>
  );
}
