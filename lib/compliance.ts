/**
 * 労働法コンプライアンスチェック — キーワードマッチ＋ルールベース
 *
 * 各ルールの根拠条文は docs/ 以下に収録済み:
 *   docs/wage-disclosure/条文まとめ.md  → 第15条
 *   docs/working-time/article.md        → 第32条
 *   docs/holidays/article.md            → 第35条
 *   docs/overtime-premium/article.md    → 第37条
 *   docs/paid-leave/article.md          → 第39条
 *   docs/dismissal-notice/article.md    → 第20条・第21条
 *   docs/probation/article.md           → 第21条
 */

export type ComplianceStatus = "ok" | "warning" | "error";

export interface ComplianceItem {
  id: string;
  label: string;
  legalRef: string;
  legalSummary: string;
  status: ComplianceStatus;
  message: string;
}

interface Rule {
  id: string;
  label: string;
  legalRef: string;
  /** 条文の核心（チェック結果に添える一文） */
  legalSummary: string;
  check: (text: string) => { status: ComplianceStatus; message: string };
}

const RULES: Rule[] = [
  // ── 第15条（労働条件の明示）────────────────────────────────
  // 根拠: docs/wage-disclosure/条文まとめ.md
  // 「賃金、労働時間その他の労働条件を明示しなければならない」
  {
    id: "wage",
    label: "賃金の明示",
    legalRef: "労基法15条",
    legalSummary: "賃金の決定・計算・支払い方法は必須明示事項",
    check(text) {
      if (/賃金|給与|月給|日給|時給|基本給|報酬/.test(text)) {
        return { status: "ok", message: "賃金に関する記載が確認できます" };
      }
      return {
        status: "error",
        message: "賃金の記載が確認できません（法定: 労働条件の必須明示事項）",
      };
    },
  },

  // ── 第32条（労働時間）────────────────────────────────────────
  // 根拠: docs/working-time/article.md
  // 「一週間について四十時間・一日について八時間を超えて労働させてはならない」
  {
    id: "working_hours",
    label: "所定労働時間",
    legalRef: "労基法32条",
    legalSummary: "週40時間・1日8時間以内が法定上限",
    check(text) {
      if (/労働時間|所定労働時間|勤務時間|就業時間/.test(text)) {
        return { status: "ok", message: "労働時間の記載が確認できます" };
      }
      return {
        status: "error",
        message:
          "労働時間の記載が確認できません（法定: 週40時間・1日8時間以内）",
      };
    },
  },

  // ── 第35条（休日）────────────────────────────────────────────
  // 根拠: docs/holidays/article.md
  // 「毎週少くとも一回の休日を与えなければならない」
  // 「四週間を通じ四日以上の休日」でも可
  {
    id: "holidays",
    label: "休日",
    legalRef: "労基法35条",
    legalSummary: "毎週1日以上 または 4週間に4日以上の休日が必要",
    check(text) {
      if (/週休2日|週に2日|週2日/.test(text)) {
        return { status: "ok", message: "週休2日の記載が確認できます" };
      }
      if (/休日|法定休日|週休|公休/.test(text)) {
        return {
          status: "warning",
          message:
            "休日の記載はありますが、週1日以上の保障が明示されているか確認してください",
        };
      }
      return {
        status: "error",
        message:
          "休日の記載が確認できません（法定: 週1日以上または4週4日以上）",
      };
    },
  },

  // ── 第37条（割増賃金）────────────────────────────────────────
  // 根拠: docs/overtime-premium/article.md
  // 「二割五分以上五割以下の範囲内で…割増賃金を支払わなければならない」
  // 「月60時間超は五割以上」「深夜（午後十時〜午前五時）は二割五分以上」
  {
    id: "overtime_premium",
    label: "時間外割増賃金",
    legalRef: "労基法37条",
    legalSummary: "時間外25%以上・月60h超50%以上・深夜25%以上の割増が必要",
    check(text) {
      if (/割増賃金|割増率|時間外手当|残業代/.test(text)) {
        if (/25%|1\.25|125%/.test(text)) {
          return {
            status: "ok",
            message: "時間外割増賃金（25%以上）の記載が確認できます",
          };
        }
        return {
          status: "warning",
          message:
            "割増賃金の記載はありますが、割増率（法定: 25%以上）が明示されているか確認してください",
        };
      }
      if (/時間外|残業/.test(text)) {
        return {
          status: "warning",
          message:
            "時間外勤務の記載はありますが、割増賃金率の記載が確認できません（法定: 25%以上）",
        };
      }
      return {
        status: "warning",
        message:
          "時間外割増賃金の記載が確認できません（法定: 25%以上）",
      };
    },
  },

  // ── 第39条（年次有給休暇）────────────────────────────────────
  // 根拠: docs/paid-leave/article.md
  // 「六箇月間継続勤務し全労働日の八割以上出勤した労働者に…
  //  十労働日の有給休暇を与えなければならない」
  // ⑦項: 年5日は使用者が時季を定めて取得させる義務
  {
    id: "paid_leave",
    label: "有給休暇",
    legalRef: "労基法39条",
    legalSummary: "6か月継続勤務後に10日付与・年5日の取得が義務",
    check(text) {
      if (/有給|有給休暇|年次有給休暇|年休/.test(text)) {
        return { status: "ok", message: "有給休暇の記載が確認できます" };
      }
      return {
        status: "error",
        message:
          "有給休暇の記載が確認できません（労基法39条 違反リスク: 6か月後に10日付与義務）",
      };
    },
  },

  // ── 第20条（解雇予告）────────────────────────────────────────
  // 根拠: docs/dismissal-notice/article.md
  // 「少くとも三十日前にその予告をしなければならない」
  // 「三十日分以上の平均賃金（解雇予告手当）を支払わなければならない」
  {
    id: "dismissal_notice",
    label: "解雇予告",
    legalRef: "労基法20条",
    legalSummary: "解雇は30日前の予告または30日分の予告手当が必要",
    check(text) {
      if (/解雇予告|30日前|三十日前/.test(text)) {
        return { status: "ok", message: "解雇予告（30日前）の記載が確認できます" };
      }
      if (/解雇|退職/.test(text)) {
        return {
          status: "warning",
          message:
            "解雇・退職の記載はありますが、30日前予告の明示を確認してください",
        };
      }
      return {
        status: "warning",
        message:
          "解雇・退職に関する記載が確認できません（法定: 30日前の予告義務）",
      };
    },
  },

  // ── 第21条（試用期間）────────────────────────────────────────
  // 根拠: docs/probation/article.md
  // 「試の使用期間中の者」は解雇予告不要
  // ただし「十四日を超えて引き続き使用されるに至つた場合」は適用される
  {
    id: "probation",
    label: "試用期間",
    legalRef: "労基法21条",
    legalSummary: "試用期間中（14日以内）は解雇予告不要。設定する場合は明示が望ましい",
    check(text) {
      if (/試用|試用期間/.test(text)) {
        return { status: "ok", message: "試用期間の記載が確認できます" };
      }
      return {
        status: "warning",
        message:
          "試用期間の記載が確認できません（設定する場合は明示が望ましい）",
      };
    },
  },
];

export function checkCompliance(text: string): ComplianceItem[] {
  return RULES.map((rule) => {
    const { status, message } = rule.check(text);
    return {
      id: rule.id,
      label: rule.label,
      legalRef: rule.legalRef,
      legalSummary: rule.legalSummary,
      status,
      message,
    };
  });
}
