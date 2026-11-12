import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";

type Language = "en" | "ru";

type Candidate = {
  id: number;
  name: string;
  description: string;
};

type Criterion = {
  id: number;
  name: string;
  weight: number;
};

type Note = {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
};

type BoardImage = {
  id: number;
  x: number;
  y: number;
  src: string;
  caption: string;
};

type Filter = {
  criterionId: number;
  min: number;
};

const translations = {
  en: {
    compare: "Compare",
    whiteboard: "Whiteboard",
    criteria: "Criteria",
    filters: "Filters",
    roulette: "Roulette",
    add: "Add",
    addCriterion: "Add criterion",
    addCandidate: "Add candidate",
    newComparison: "New",
    comparisons: "My Comparisons",
    whatChoose: "What should I choose?",
    overall: "Overall",
    chooseRoulette: "Choose with Roulette",
    quality: "Quality",
    price: "Price",
    design: "Design",
    score: "Score",
    importance: "Importance",
    name: "Name",
    description: "Description",
    addNewCriterion: "Add new criterion",
    criterionName: "Criterion name",
    importanceLevel: "Importance level",
    cancel: "Cancel",
    save: "Save",
    addNewCandidate: "Add new candidate",
    search: "Search...",
    noResults: "No results found",
    whiteboardHint:
      "Drag notes and images. Use the drawing tool to sketch directly on the board.",
    note: "Note",
    image: "Image",
    draw: "Draw",
    erase: "Erase",
    clearDrawing: "Clear drawing",
    rouletteTitle: "Let Kurabi decide",
    rouletteDescription:
      "Choose how Kurabi should select a candidate.",
    topRated: "Highly rated",
    matching: "Matching conditions",
    allCandidates: "All candidates",
    spin: "Spin",
    winner: "Kurabi chose",
    close: "Close",
    addNote: "Add note",
    noteText: "Write your note...",
    addImage: "Add image",
    imageUrl: "Image URL",
    caption: "Caption",
    noCriteria: "No criteria yet",
    filterBy: "Filter candidates",
    minScore: "Minimum score",
    clearFilters: "Clear filters",
    language: "Language",
  },

  ru: {
    compare: "Сравнение",
    whiteboard: "Доска",
    criteria: "Критерии",
    filters: "Фильтры",
    roulette: "Рулетка",
    add: "Добавить",
    addCriterion: "Добавить критерий",
    addCandidate: "Добавить вариант",
    newComparison: "Новый",
    comparisons: "Мои сравнения",
    whatChoose: "Что выбрать?",
    overall: "Итог",
    chooseRoulette: "Выбрать рулеткой",
    quality: "Качество",
    price: "Цена",
    design: "Дизайн",
    score: "Оценка",
    importance: "Важность",
    name: "Название",
    description: "Описание",
    addNewCriterion: "Новый критерий",
    criterionName: "Название критерия",
    importanceLevel: "Важность",
    cancel: "Отмена",
    save: "Сохранить",
    addNewCandidate: "Новый вариант",
    search: "Поиск...",
    noResults: "Ничего не найдено",
    whiteboardHint:
      "Перетаскивайте заметки и изображения. Используйте инструмент рисования.",
    note: "Заметка",
    image: "Изображение",
    draw: "Рисовать",
    erase: "Ластик",
    clearDrawing: "Очистить рисунок",
    rouletteTitle: "Пусть Kurabi решит",
    rouletteDescription:
      "Выберите способ, которым Kurabi должен выбрать вариант.",
    topRated: "Лучшие по оценке",
    matching: "Подходящие условия",
    allCandidates: "Все варианты",
    spin: "Крутить",
    winner: "Kurabi выбрал",
    close: "Закрыть",
    addNote: "Добавить заметку",
    noteText: "Напишите заметку...",
    addImage: "Добавить изображение",
    imageUrl: "URL изображения",
    caption: "Подпись",
    noCriteria: "Критериев пока нет",
    filterBy: "Фильтр вариантов",
    minScore: "Минимальная оценка",
    clearFilters: "Сбросить фильтры",
    language: "Язык",
  },
};

const initialCandidates: Candidate[] = [
  {
    id: 1,
    name: "Option A",
    description: "A balanced and reliable choice.",
  },
  {
    id: 2,
    name: "Option B",
    description: "A practical option with a lower price.",
  },
  {
    id: 3,
    name: "Option C",
    description: "A premium choice with the strongest overall fit.",
  },
];

const initialCriteria: Criterion[] = [
  {
    id: 1,
    name: "Quality",
    weight: 5,
  },
  {
    id: 2,
    name: "Price",
    weight: 3,
  },
  {
    id: 3,
    name: "Design",
    weight: 4,
  },
];

const initialScores: Record<number, Record<number, number>> = {
  1: {
    1: 9,
    2: 8,
    3: 7,
  },
  2: {
    1: 8,
    2: 9,
    3: 7,
  },
  3: {
    1: 10,
    2: 7,
    3: 10,
  },
};

const initialNotes: Note[] = [
  {
    id: 1,
    x: 7,
    y: 12,
    text: "Check the details",
    color: "yellow",
  },
  {
    id: 2,
    x: 45,
    y: 24,
    text: "Best design",
    color: "pink",
  },
  {
    id: 3,
    x: 70,
    y: 58,
    text: "Maybe choose C",
    color: "blue",
  },
];

const initialImages: BoardImage[] = [
  {
    id: 1,
    x: 58,
    y: 8,
    src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80",
    caption: "Inspiration",
  },
];

function App() {
  const [language, setLanguage] =
    useState<Language>("en");

  const t = translations[language];

  const [activeTab, setActiveTab] =
    useState("compare");

  const [candidates, setCandidates] =
    useState<Candidate[]>(initialCandidates);

  const [criteria, setCriteria] =
    useState<Criterion[]>(initialCriteria);

  const [scores, setScores] =
    useState(initialScores);

  const [notes, setNotes] =
    useState<Note[]>(initialNotes);

  const [images, setImages] =
    useState<BoardImage[]>(initialImages);

  const [search, setSearch] =
    useState("");

  const [filters, setFilters] =
    useState<Filter[]>([]);

  const [showCriterionModal, setShowCriterionModal] =
    useState(false);

  const [showCandidateModal, setShowCandidateModal] =
    useState(false);

  const [showNoteModal, setShowNoteModal] =
    useState(false);

  const [showImageModal, setShowImageModal] =
    useState(false);

  const [showRoulette, setShowRoulette] =
    useState(false);

  const [rouletteMode, setRouletteMode] =
    useState<"top" | "matching" | "all">("top");

  const [winner, setWinner] =
    useState<Candidate | null>(null);

  const [newCriterion, setNewCriterion] =
    useState({
      name: "",
      weight: 3,
    });

  const [newCandidate, setNewCandidate] =
    useState({
      name: "",
      description: "",
    });

  const [newNote, setNewNote] =
    useState("");

  const [newImage, setNewImage] =
    useState({
      src: "",
      caption: "",
    });

  const [drawing, setDrawing] =
    useState(false);

  const [eraser, setEraser] =
    useState(false);

  const drawingCanvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const dragOffset =
    useRef({
      x: 0,
      y: 0,
    });

  const [draggingNote, setDraggingNote] =
    useState<number | null>(null);

  const [draggingImage, setDraggingImage] =
    useState<number | null>(null);

  const drawLastPoint =
    useRef<{ x: number; y: number } | null>(null);

  const boardRef =
    useRef<HTMLDivElement | null>(null);

  const calculateScore = (
    candidateId: number
  ) => {
    const totalWeight =
      criteria.reduce(
        (sum, c) => sum + c.weight,
        0
      );

    if (totalWeight === 0) {
      return 0;
    }

    const weighted =
      criteria.reduce((sum, criterion) => {
        const value =
          scores[candidateId]?.[criterion.id] ??
          0;

        return (
          sum +
          value * criterion.weight
        );
      }, 0);

    return Math.round(
      (weighted / (totalWeight * 10)) *
        100
    );
  };

  const candidateScores = useMemo(() => {
    return candidates.map((candidate) => ({
      ...candidate,
      score: calculateScore(candidate.id),
    }));
  }, [candidates, criteria, scores]);

  const filteredCandidates =
    candidateScores.filter((candidate) => {
      const matchesSearch =
        candidate.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilters =
        filters.every((filter) => {
          const value =
            scores[candidate.id]?.[
              filter.criterionId
            ] ?? 0;

          return value >= filter.min;
        });

      return (
        matchesSearch &&
        matchesFilters
      );
    });

  const bestCandidate =
    [...candidateScores].sort(
      (a, b) => b.score - a.score
    )[0];

  const openRoulette = () => {
    setWinner(null);
    setShowRoulette(true);
  };

  const spinRoulette = () => {
    let pool = candidateScores;

    if (rouletteMode === "top") {
      pool = candidateScores.filter(
        (candidate) =>
          candidate.score >= 80
      );

      if (pool.length === 0) {
        pool = candidateScores;
      }
    }

    if (rouletteMode === "matching") {
      pool = filteredCandidates;

      if (pool.length === 0) {
        pool = candidateScores;
      }
    }

    const selected =
      pool[
        Math.floor(
          Math.random() *
            pool.length
        )
      ];

    setWinner(selected);
  };

  const addCriterion = () => {
    if (!newCriterion.name.trim()) {
      return;
    }

    const id =
      Date.now();

    setCriteria((prev) => [
      ...prev,
      {
        id,
        name:
          newCriterion.name,
        weight:
          newCriterion.weight,
      },
    ]);

    setScores((prev) => {
      const updated = {
        ...prev,
      };

      candidates.forEach(
        (candidate) => {
          if (!updated[candidate.id]) {
            updated[candidate.id] =
              {};
          }

          updated[candidate.id][id] =
            5;
        }
      );

      return updated;
    });

    setNewCriterion({
      name: "",
      weight: 3,
    });

    setShowCriterionModal(false);
  };

  const addCandidate = () => {
    if (!newCandidate.name.trim()) {
      return;
    }

    const id =
      Date.now();

    setCandidates((prev) => [
      ...prev,
      {
        id,
        name:
          newCandidate.name,
        description:
          newCandidate.description,
      },
    ]);

    const candidateScores: Record<
      number,
      number
    > = {};

    criteria.forEach(
      (criterion) => {
        candidateScores[
          criterion.id
        ] = 5;
      }
    );

    setScores((prev) => ({
      ...prev,
      [id]: candidateScores,
    }));

    setNewCandidate({
      name: "",
      description: "",
    });

    setShowCandidateModal(false);
  };

  const addNote = () => {
    if (!newNote.trim()) {
      return;
    }

    setNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: 20,
        y: 20,
        text: newNote,
        color:
          ["yellow", "pink", "blue"][
            prev.length % 3
          ],
      },
    ]);

    setNewNote("");
    setShowNoteModal(false);
  };

  const addImage = () => {
    if (!newImage.src.trim()) {
      return;
    }

    setImages((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: 30,
        y: 30,
        src: newImage.src,
        caption:
          newImage.caption,
      },
    ]);

    setNewImage({
      src: "",
      caption: "",
    });

    setShowImageModal(false);
  };

  const setupCanvas = () => {
    const canvas =
      drawingCanvasRef.current;

    const board =
      boardRef.current;

    if (!canvas || !board) {
      return;
    }

    const rect =
      board.getBoundingClientRect();

    const ratio =
      window.devicePixelRatio ||
      1;

    canvas.width =
      rect.width * ratio;

    canvas.height =
      rect.height * ratio;

    canvas.style.width =
      `${rect.width}px`;

    canvas.style.height =
      `${rect.height}px`;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );

    context.lineCap =
      "round";

    context.lineJoin =
      "round";

    context.strokeStyle =
      "#38445c";

    context.lineWidth = 3;
  };

  useEffect(() => {
    if (activeTab === "whiteboard") {
      const timer =
        window.setTimeout(
          setupCanvas,
          50
        );

      window.addEventListener(
        "resize",
        setupCanvas
      );

      return () => {
        window.clearTimeout(
          timer
        );

        window.removeEventListener(
          "resize",
          setupCanvas
        );
      };
    }
  }, [activeTab]);

  const getCanvasPoint = (
    event:
      | React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas =
      drawingCanvasRef.current;

    if (!canvas) {
      return null;
    }

    const rect =
      canvas.getBoundingClientRect();

    return {
      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top,
    };
  };

  const startDrawing = (
    event:
      React.PointerEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();

    const point =
      getCanvasPoint(event);

    if (!point) {
      return;
    }

    const canvas =
      drawingCanvasRef.current;

    canvas?.setPointerCapture(
      event.pointerId
    );

    drawLastPoint.current =
      point;

    setDrawing(true);
  };

  const draw = (
    event:
      React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (
      !drawing ||
      !drawLastPoint.current
    ) {
      return;
    }

    event.preventDefault();

    const point =
      getCanvasPoint(event);

    const canvas =
      drawingCanvasRef.current;

    if (
      !point ||
      !canvas
    ) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.strokeStyle =
      eraser
        ? "#ffffff"
        : "#38445c";

    context.lineWidth =
      eraser ? 20 : 3;

    context.beginPath();

    context.moveTo(
      drawLastPoint.current.x,
      drawLastPoint.current.y
    );

    context.lineTo(
      point.x,
      point.y
    );

    context.stroke();

    drawLastPoint.current =
      point;
  };

  const stopDrawing = (
    event:
      React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    setDrawing(false);
    drawLastPoint.current =
      null;
  };

  const clearDrawing = () => {
    const canvas =
      drawingCanvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  const startNoteDrag = (
    event:
      React.PointerEvent<HTMLDivElement>,
    note: Note
  ) => {
    event.preventDefault();

    const board =
      boardRef.current;

    if (!board) {
      return;
    }

    const boardRect =
      board.getBoundingClientRect();

    const left =
      boardRect.left +
      (note.x / 100) *
        boardRect.width;

    const top =
      boardRect.top +
      (note.y / 100) *
        boardRect.height;

    dragOffset.current = {
      x:
        event.clientX -
        left,

      y:
        event.clientY -
        top,
    };

    setDraggingNote(
      note.id
    );

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  };

  const moveNote = (
    event:
      React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      draggingNote === null
    ) {
      return;
    }

    const board =
      boardRef.current;

    if (!board) {
      return;
    }

    const rect =
      board.getBoundingClientRect();

    const noteWidth =
      event.currentTarget.offsetWidth;

    const noteHeight =
      event.currentTarget.offsetHeight;

    let x =
      ((event.clientX -
        dragOffset.current.x -
        rect.left) /
        rect.width) *
      100;

    let y =
      ((event.clientY -
        dragOffset.current.y -
        rect.top) /
        rect.height) *
      100;

    const maxX =
      100 -
      (noteWidth /
        rect.width) *
        100;

    const maxY =
      100 -
      (noteHeight /
        rect.height) *
        100;

    x =
      Math.max(
        0,
        Math.min(
          x,
          maxX
        )
      );

    y =
      Math.max(
        0,
        Math.min(
          y,
          maxY
        )
      );

    setNotes((prev) =>
      prev.map((item) =>
        item.id ===
        draggingNote
          ? {
              ...item,
              x,
              y,
            }
          : item
      )
    );
  };

  const stopNoteDrag = (
    event:
      React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    setDraggingNote(
      null
    );
  };

  const startImageDrag = (
    event:
      React.PointerEvent<HTMLDivElement>,
    image: BoardImage
  ) => {
    event.preventDefault();

    const board =
      boardRef.current;

    if (!board) {
      return;
    }

    const boardRect =
      board.getBoundingClientRect();

    const left =
      boardRect.left +
      (image.x / 100) *
        boardRect.width;

    const top =
      boardRect.top +
      (image.y / 100) *
        boardRect.height;

    dragOffset.current = {
      x:
        event.clientX -
        left,

      y:
        event.clientY -
        top,
    };

    setDraggingImage(
      image.id
    );

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  };

  const moveImage = (
    event:
      React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      draggingImage === null
    ) {
      return;
    }

    const board =
      boardRef.current;

    if (!board) {
      return;
    }

    const rect =
      board.getBoundingClientRect();

    const width =
      event.currentTarget.offsetWidth;

    const height =
      event.currentTarget.offsetHeight;

    let x =
      ((event.clientX -
        dragOffset.current.x -
        rect.left) /
        rect.width) *
      100;

    let y =
      ((event.clientY -
        dragOffset.current.y -
        rect.top) /
        rect.height) *
      100;

    const maxX =
      100 -
      (width /
        rect.width) *
        100;

    const maxY =
      100 -
      (height /
        rect.height) *
        100;

    x =
      Math.max(
        0,
        Math.min(
          x,
          maxX
        )
      );

    y =
      Math.max(
        0,
        Math.min(
          y,
          maxY
        )
      );

    setImages((prev) =>
      prev.map((item) =>
        item.id ===
        draggingImage
          ? {
              ...item,
              x,
              y,
            }
          : item
      )
    );
  };

  const stopImageDrag = (
    event:
      React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    setDraggingImage(
      null
    );
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="crab">
            🦀
          </div>

          <div>
            <div className="brand-name">
              KURABI
            </div>

            <div className="brand-subtitle">
              Choose what fits you
            </div>
          </div>
        </div>

        <div className="top-actions">
          <button
            className="comparison-button"
          >
            {t.comparisons}
          </button>

          <button
            className="primary-button"
            onClick={() => {
              setCandidates([]);
              setScores({});
            }}
          >
            + {t.newComparison}
          </button>

          <div className="language-switch">
            <button
              className={
                language === "en"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLanguage("en")
              }
            >
              EN
            </button>

            <button
              className={
                language === "ru"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLanguage("ru")
              }
            >
              RU
            </button>
          </div>
        </div>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <nav>
            <button
              className={
                activeTab ===
                "compare"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                setActiveTab(
                  "compare"
                )
              }
            >
              <span>◈</span>
              {t.compare}
            </button>

            <button
              className={
                activeTab ===
                "whiteboard"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                setActiveTab(
                  "whiteboard"
                )
              }
            >
              <span>□</span>
              {t.whiteboard}
            </button>

            <button
              className={
                activeTab ===
                "criteria"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                setActiveTab(
                  "criteria"
                )
              }
            >
              <span>◎</span>
              {t.criteria}
            </button>

            <button
              className={
                activeTab ===
                "filters"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                setActiveTab(
                  "filters"
                )
              }
            >
              <span>⌁</span>
              {t.filters}
            </button>

            <button
              className={
                activeTab ===
                "roulette"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => {
                setActiveTab(
                  "roulette"
                );
                openRoulette();
              }}
            >
              <span>◉</span>
              {t.roulette}
            </button>
          </nav>

          <div className="sidebar-bottom">
            <button
              className="add-side-button"
              onClick={() =>
                setShowCriterionModal(
                  true
                )
              }
            >
              <span>+</span>
              {t.addCriterion}
            </button>

            <button
              className="add-side-button"
              onClick={() =>
                setShowCandidateModal(
                  true
                )
              }
            >
              <span>+</span>
              {t.addCandidate}
            </button>
          </div>
        </aside>

        <main className="main">
          {activeTab ===
            "compare" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">
                    KURABI
                  </span>

                  <h1>
                    {t.whatChoose}
                  </h1>

                  <p>
                    Compare what
                    matters to you
                    and find your
                    best fit.
                  </p>
                </div>

                <div className="best-match">
                  <span>
                    Best match
                  </span>

                  <strong>
                    {bestCandidate
                      ?.name ||
                      "—"}
                  </strong>

                  <small>
                    {bestCandidate
                      ? `${bestCandidate.score} / 100`
                      : "—"}
                  </small>
                </div>
              </div>

              <div className="search-row">
                <div className="search-box">
                  <span>
                    ⌕
                  </span>

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder={
                      t.search
                    }
                  />
                </div>

                <button
                  className="soft-button"
                  onClick={() =>
                    setShowCandidateModal(
                      true
                    )
                  }
                >
                  + {t.addCandidate}
                </button>
              </div>

              <div className="candidate-grid">
                {filteredCandidates.map(
                  (candidate) => (
                    <div
                      className="candidate-card"
                      key={
                        candidate.id
                      }
                    >
                      <div className="candidate-top">
                        <div className="candidate-icon">
                          {candidate.name
                            .slice(
                              0,
                              1
                            )
                            .toUpperCase()}
                        </div>

                        <div className="score-badge">
                          {candidate.score}
                          <span>
                            ★
                          </span>
                        </div>
                      </div>

                      <h3>
                        {
                          candidate.name
                        }
                      </h3>

                      <p>
                        {
                          candidate.description
                        }
                      </p>

                      <div className="score-line">
                        <div
                          className="score-fill"
                          style={{
                            width:
                              `${candidate.score}%`,
                          }}
                        />
                      </div>

                      <div className="criteria-mini">
                        {criteria
                          .slice(
                            0,
                            3
                          )
                          .map(
                            (
                              criterion
                            ) => (
                              <span
                                key={
                                  criterion.id
                                }
                              >
                                {
                                  criterion.name
                                }{" "}
                                <b>
                                  {
                                    scores[
                                      candidate.id
                                    ]?.[
                                      criterion.id
                                    ]
                                  }
                                </b>
                              </span>
                            )
                          )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {filteredCandidates.length ===
                0 && (
                <div className="empty-state">
                  {t.noResults}
                </div>
              )}

              <section className="comparison-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      OVERVIEW
                    </span>

                    <h2>
                      Compare your
                      criteria
                    </h2>
                  </div>

                  <button
                    className="outline-button"
                    onClick={() =>
                      setShowCriterionModal(
                        true
                      )
                    }
                  >
                    +{" "}
                    {
                      t.addCriterion
                    }
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          {t.criteria}
                        </th>

                        {candidateScores.map(
                          (
                            candidate
                          ) => (
                            <th
                              key={
                                candidate.id
                              }
                            >
                              {
                                candidate.name
                              }
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {criteria.map(
                        (
                          criterion
                        ) => (
                          <tr
                            key={
                              criterion.id
                            }
                          >
                            <td>
                              <div className="criterion-cell">
                                <strong>
                                  {
                                    criterion.name
                                  }
                                </strong>

                                <small>
                                  {t.importance}{" "}
                                  {
                                    criterion.weight
                                  }
                                  / 5
                                </small>
                              </div>
                            </td>

                            {candidateScores.map(
                              (
                                candidate
                              ) => (
                                <td
                                  key={
                                    candidate.id
                                  }
                                >
                                  <div className="rating">
                                    <span>
                                      {
                                        scores[
                                          candidate.id
                                        ]?.[
                                          criterion.id
                                        ] ??
                                        0
                                      }
                                    </span>

                                    <input
                                      type="range"
                                      min="0"
                                      max="10"
                                      value={
                                        scores[
                                          candidate.id
                                        ]?.[
                                          criterion.id
                                        ] ??
                                        0
                                      }
                                      onChange={(
                                        e
                                      ) => {
                                        const value =
                                          Number(
                                            e
                                              .target
                                              .value
                                          );

                                        setScores(
                                          (
                                            prev
                                          ) => ({
                                            ...prev,
                                            [candidate.id]:
                                              {
                                                ...prev[
                                                  candidate.id
                                                ],
                                                [criterion.id]:
                                                  value,
                                              },
                                          })
                                        );
                                      }}
                                    />
                                  </div>
                                </td>
                              )
                            )}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="bottom-choice">
                <div>
                  <span>
                    {t.overall}
                  </span>

                  <strong>
                    {bestCandidate
                      ?.score ??
                      0}
                  </strong>

                  <small>
                    / 100
                  </small>
                </div>

                <button
                  className="roulette-button"
                  onClick={
                    openRoulette
                  }
                >
                  ◉{" "}
                  {
                    t.chooseRoulette
                  }
                </button>
              </div>
            </>
          )}

          {activeTab ===
            "whiteboard" && (
            <section className="whiteboard-page">
              <div className="page-heading compact">
                <div>
                  <span className="eyebrow">
                    KURABI BOARD
                  </span>

                  <h1>
                    {t.whiteboard}
                  </h1>

                  <p>
                    {
                      t.whiteboardHint
                    }
                  </p>
                </div>
              </div>

              <div className="board-toolbar">
                <button
                  className="tool-button"
                  onClick={() =>
                    setShowNoteModal(
                      true
                    )
                  }
                >
                  📝{" "}
                  {t.addNote}
                </button>

                <button
                  className="tool-button"
                  onClick={() =>
                    setShowImageModal(
                      true
                    )
                  }
                >
                  🖼{" "}
                  {t.addImage}
                </button>

                <button
                  className={
                    !eraser
                      ? "tool-button selected"
                      : "tool-button"
                  }
                  onClick={() =>
                    setEraser(
                      false
                    )
                  }
                >
                  ✏️{" "}
                  {t.draw}
                </button>

                <button
                  className={
                    eraser
                      ? "tool-button selected"
                      : "tool-button"
                  }
                  onClick={() =>
                    setEraser(
                      true
                    )
                  }
                >
                  🧽{" "}
                  {t.erase}
                </button>

                <button
                  className="tool-button danger"
                  onClick={
                    clearDrawing
                  }
                >
                  ⌫{" "}
                  {
                    t.clearDrawing
                  }
                </button>
              </div>

              <div
                ref={
                  boardRef
                }
                className="whiteboard"
              >
                <div className="board-grid" />

                <canvas
                  ref={
                    drawingCanvasRef
                  }
                  className="drawing-layer"
                  onPointerDown={
                    startDrawing
                  }
                  onPointerMove={
                    draw
                  }
                  onPointerUp={
                    stopDrawing
                  }
                  onPointerCancel={
                    stopDrawing
                  }
                />

                {notes.map(
                  (note) => (
                    <div
                      key={
                        note.id
                      }
                      className={`sticky-note ${note.color} ${
                        draggingNote ===
                        note.id
                          ? "dragging"
                          : ""
                      }`}
                      style={{
                        left:
                          `${note.x}%`,
                        top:
                          `${note.y}%`,
                      }}
                      onPointerDown={(
                        event
                      ) =>
                        startNoteDrag(
                          event,
                          note
                        )
                      }
                      onPointerMove={
                        moveNote
                      }
                      onPointerUp={
                        stopNoteDrag
                      }
                      onPointerCancel={
                        stopNoteDrag
                      }
                    >
                      <div className="note-pin">
                        •
                      </div>

                      <div>
                        {
                          note.text
                        }
                      </div>
                    </div>
                  )
                )}

                {images.map(
                  (image) => (
                    <div
                      key={
                        image.id
                      }
                      className={`board-image ${
                        draggingImage ===
                        image.id
                          ? "dragging"
                          : ""
                      }`}
                      style={{
                        left:
                          `${image.x}%`,
                        top:
                          `${image.y}%`,
                      }}
                      onPointerDown={(
                        event
                      ) =>
                        startImageDrag(
                          event,
                          image
                        )
                      }
                      onPointerMove={
                        moveImage
                      }
                      onPointerUp={
                        stopImageDrag
                      }
                      onPointerCancel={
                        stopImageDrag
                      }
                    >
                      <img
                        src={
                          image.src
                        }
                        alt={
                          image.caption
                        }
                        draggable={
                          false
                        }
                      />

                      <span>
                        {
                          image.caption
                        }
                      </span>
                    </div>
                  )
                )}

                <div className="board-hint">
                  ✨ Draw, write,
                  compare, decide.
                </div>
              </div>
            </section>
          )}

          {activeTab ===
            "criteria" && (
            <section className="simple-page">
              <div className="page-heading compact">
                <div>
                  <span className="eyebrow">
                    CUSTOMIZE
                  </span>

                  <h1>
                    {t.criteria}
                  </h1>

                  <p>
                    Decide what
                    matters most
                    to you.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowCriterionModal(
                      true
                    )
                  }
                >
                  +{" "}
                  {
                    t.addCriterion
                  }
                </button>
              </div>

              <div className="criteria-grid">
                {criteria.map(
                  (
                    criterion
                  ) => (
                    <div
                      className="criterion-card"
                      key={
                        criterion.id
                      }
                    >
                      <div className="criterion-symbol">
                        ◎
                      </div>

                      <div>
                        <h3>
                          {
                            criterion.name
                          }
                        </h3>

                        <p>
                          {
                            t.importance
                          }
                        </p>

                        <div className="importance">
                          {Array.from(
                            {
                              length: 5,
                            }
                          ).map(
                            (
                              _,
                              index
                            ) => (
                              <button
                                key={
                                  index
                                }
                                className={
                                  index <
                                  criterion.weight
                                    ? "filled"
                                    : ""
                                }
                                onClick={() => {
                                  setCriteria(
                                    (
                                      prev
                                    ) =>
                                      prev.map(
                                        (
                                          item
                                        ) =>
                                          item.id ===
                                          criterion.id
                                            ? {
                                                ...item,
                                                weight:
                                                  index +
                                                  1,
                                              }
                                            : item
                                      )
                                  );
                                }}
                              >
                                ★
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {activeTab ===
            "filters" && (
            <section className="simple-page">
              <div className="page-heading compact">
                <div>
                  <span className="eyebrow">
                    NARROW IT DOWN
                  </span>

                  <h1>
                    {t.filters}
                  </h1>

                  <p>
                    {
                      t.filterBy
                    }
                  </p>
                </div>

                <button
                  className="soft-button"
                  onClick={() =>
                    setFilters(
                      []
                    )
                  }
                >
                  {
                    t.clearFilters
                  }
                </button>
              </div>

              <div className="filter-panel">
                {criteria.map(
                  (
                    criterion
                  ) => {
                    const current =
                      filters.find(
                        (
                          filter
                        ) =>
                          filter.criterionId ===
                          criterion.id
                      )?.min ??
                      0;

                    return (
                      <div
                        className="filter-row"
                        key={
                          criterion.id
                        }
                      >
                        <div>
                          <strong>
                            {
                              criterion.name
                            }
                          </strong>

                          <span>
                            {
                              t.minScore
                            }
                          </span>
                        </div>

                        <div className="filter-control">
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={
                              current
                            }
                            onChange={(
                              e
                            ) => {
                              const value =
                                Number(
                                  e
                                    .target
                                    .value
                                );

                              setFilters(
                                (
                                  prev
                                ) => {
                                  const without =
                                    prev.filter(
                                      (
                                        item
                                      ) =>
                                        item.criterionId !==
                                        criterion.id
                                    );

                                  return value ===
                                    0
                                    ? without
                                    : [
                                        ...without,
                                        {
                                          criterionId:
                                            criterion.id,
                                          min:
                                            value,
                                        },
                                      ];
                                }
                              );
                            }}
                          />

                          <b>
                            {current}
                          </b>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="filter-results">
                <h2>
                  {
                    filteredCandidates.length
                  }{" "}
                  candidates
                </h2>

                <div className="candidate-grid">
                  {filteredCandidates.map(
                    (
                      candidate
                    ) => (
                      <div
                        className="candidate-card small"
                        key={
                          candidate.id
                        }
                      >
                        <div className="candidate-top">
                          <div className="candidate-icon">
                            {candidate.name
                              .slice(
                                0,
                                1
                              )
                              .toUpperCase()}
                          </div>

                          <div className="score-badge">
                            {
                              candidate.score
                            }
                            <span>
                              ★
                            </span>
                          </div>
                        </div>

                        <h3>
                          {
                            candidate.name
                          }
                        </h3>

                        <p>
                          {
                            candidate.description
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab ===
            "roulette" && (
            <section className="simple-page roulette-page">
              <div className="roulette-hero">
                <div className="roulette-orb">
                  ◉
                </div>

                <span className="eyebrow">
                  KURABI RANDOM
                </span>

                <h1>
                  {
                    t.rouletteTitle
                  }
                </h1>

                <p>
                  {
                    t.rouletteDescription
                  }
                </p>

                <div className="roulette-options">
                  <button
                    className={
                      rouletteMode ===
                      "top"
                        ? "roulette-option selected"
                        : "roulette-option"
                    }
                    onClick={() =>
                      setRouletteMode(
                        "top"
                      )
                    }
                  >
                    <strong>
                      ★
                    </strong>

                    <span>
                      {
                        t.topRated
                      }
                    </span>
                  </button>

                  <button
                    className={
                      rouletteMode ===
                      "matching"
                        ? "roulette-option selected"
                        : "roulette-option"
                    }
                    onClick={() =>
                      setRouletteMode(
                        "matching"
                      )
                    }
                  >
                    <strong>
                      ◇
                    </strong>

                    <span>
                      {
                        t.matching
                      }
                    </span>
                  </button>

                  <button
                    className={
                      rouletteMode ===
                      "all"
                        ? "roulette-option selected"
                        : "roulette-option"
                    }
                    onClick={() =>
                      setRouletteMode(
                        "all"
                      )
                    }
                  >
                    <strong>
                      ◎
                    </strong>

                    <span>
                      {
                        t.allCandidates
                      }
                    </span>
                  </button>
                </div>

                <button
                  className="spin-button"
                  onClick={
                    spinRoulette
                  }
                >
                  ◉{" "}
                  {
                    t.spin
                  }
                </button>

                {winner && (
                  <div className="winner-card">
                    <span>
                      {
                        t.winner
                      }
                    </span>

                    <h2>
                      {
                        winner.name
                      }
                    </h2>

                    <div className="winner-score">
                      {
                        winner.score
                      }
                      <small>
                        / 100
                      </small>
                    </div>

                    <p>
                      {
                        winner.description
                      }
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {showCriterionModal && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setShowCriterionModal(
              false
            )
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setShowCriterionModal(
                  false
                )
              }
            >
              ×
            </button>

            <span className="eyebrow">
              KURABI
            </span>

            <h2>
              {
                t.addNewCriterion
              }
            </h2>

            <label>
              {
                t.criterionName
              }

              <input
                value={
                  newCriterion.name
                }
                onChange={(e) =>
                  setNewCriterion(
                    {
                      ...newCriterion,
                      name:
                        e.target
                          .value,
                    }
                  )
                }
                autoFocus
              />
            </label>

            <label>
              {
                t.importanceLevel
              }

              <input
                type="range"
                min="1"
                max="5"
                value={
                  newCriterion.weight
                }
                onChange={(e) =>
                  setNewCriterion(
                    {
                      ...newCriterion,
                      weight:
                        Number(
                          e
                            .target
                            .value
                        ),
                    }
                  )
                }
              />

              <strong>
                {
                  newCriterion.weight
                }
                / 5
              </strong>
            </label>

            <div className="modal-actions">
              <button
                className="soft-button"
                onClick={() =>
                  setShowCriterionModal(
                    false
                  )
                }
              >
                {
                  t.cancel
                }
              </button>

              <button
                className="primary-button"
                onClick={
                  addCriterion
                }
              >
                {
                  t.save
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {showCandidateModal && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setShowCandidateModal(
              false
            )
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setShowCandidateModal(
                  false
                )
              }
            >
              ×
            </button>

            <span className="eyebrow">
              KURABI
            </span>

            <h2>
              {
                t.addNewCandidate
              }
            </h2>

            <label>
              {
                t.name
              }

              <input
                value={
                  newCandidate.name
                }
                onChange={(e) =>
                  setNewCandidate(
                    {
                      ...newCandidate,
                      name:
                        e
                          .target
                          .value,
                    }
                  )
                }
                autoFocus
              />
            </label>

            <label>
              {
                t.description
              }

              <textarea
                value={
                  newCandidate.description
                }
                onChange={(e) =>
                  setNewCandidate(
                    {
                      ...newCandidate,
                      description:
                        e
                          .target
                          .value,
                    }
                  )
                }
              />
            </label>

            <div className="modal-actions">
              <button
                className="soft-button"
                onClick={() =>
                  setShowCandidateModal(
                    false
                  )
                }
              >
                {
                  t.cancel
                }
              </button>

              <button
                className="primary-button"
                onClick={
                  addCandidate
                }
              >
                {
                  t.save
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {showNoteModal && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setShowNoteModal(
              false
            )
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setShowNoteModal(
                  false
                )
              }
            >
              ×
            </button>

            <span className="eyebrow">
              WHITEBOARD
            </span>

            <h2>
              {
                t.addNote
              }
            </h2>

            <label>
              {
                t.noteText
              }

              <textarea
                value={
                  newNote
                }
                onChange={(e) =>
                  setNewNote(
                    e
                      .target
                      .value
                  )
                }
                autoFocus
              />
            </label>

            <div className="modal-actions">
              <button
                className="soft-button"
                onClick={() =>
                  setShowNoteModal(
                    false
                  )
                }
              >
                {
                  t.cancel
                }
              </button>

              <button
                className="primary-button"
                onClick={
                  addNote
                }
              >
                {
                  t.save
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setShowImageModal(
              false
            )
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setShowImageModal(
                  false
                )
              }
            >
              ×
            </button>

            <span className="eyebrow">
              WHITEBOARD
            </span>

            <h2>
              {
                t.addImage
              }
            </h2>

            <label>
              {
                t.imageUrl
              }

              <input
                value={
                  newImage.src
                }
                onChange={(e) =>
                  setNewImage(
                    {
                      ...newImage,
                      src:
                        e
                          .target
                          .value,
                    }
                  )
                }
                autoFocus
              />
            </label>

            <label>
              {
                t.caption
              }

              <input
                value={
                  newImage.caption
                }
                onChange={(e) =>
                  setNewImage(
                    {
                      ...newImage,
                      caption:
                        e
                          .target
                          .value,
                    }
                  )
                }
              />
            </label>

            <div className="modal-actions">
              <button
                className="soft-button"
                onClick={() =>
                  setShowImageModal(
                    false
                  )
                }
              >
                {
                  t.cancel
                }
              </button>

              <button
                className="primary-button"
                onClick={
                  addImage
                }
              >
                {
                  t.save
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {showRoulette && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setShowRoulette(
              false
            )
          }
        >
          <div
            className="roulette-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setShowRoulette(
                  false
                )
              }
            >
              ×
            </button>

            <div className="roulette-orb large">
              ◉
            </div>

            <span className="eyebrow">
              KURABI
            </span>

            <h2>
              {
                t.rouletteTitle
              }
            </h2>

            <p>
              {
                t.rouletteDescription
              }
            </p>

            <div className="roulette-options compact-options">
              <button
                className={
                  rouletteMode ===
                  "top"
                    ? "roulette-option selected"
                    : "roulette-option"
                }
                onClick={() =>
                  setRouletteMode(
                    "top"
                  )
                }
              >
                ★{" "}
                {
                  t.topRated
                }
              </button>

              <button
                className={
                  rouletteMode ===
                  "matching"
                    ? "roulette-option selected"
                    : "roulette-option"
                }
                onClick={() =>
                  setRouletteMode(
                    "matching"
                  )
                }
              >
                ◇{" "}
                {
                  t.matching
                }
              </button>

              <button
                className={
                  rouletteMode ===
                  "all"
                    ? "roulette-option selected"
                    : "roulette-option"
                }
                onClick={() =>
                  setRouletteMode(
                    "all"
                  )
                }
              >
                ◎{" "}
                {
                  t.allCandidates
                }
              </button>
            </div>

            <button
              className="spin-button"
              onClick={
                spinRoulette
              }
            >
              ◉{" "}
              {
                t.spin
              }
            </button>

            {winner && (
              <div className="winner-card">
                <span>
                  {
                    t.winner
                  }
                </span>

                <h2>
                  {
                    winner.name
                  }
                </h2>

                <div className="winner-score">
                  {
                    winner.score
                  }
                  <small>
                    / 100
                  </small>
                </div>

                <p>
                  {
                    winner.description
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;