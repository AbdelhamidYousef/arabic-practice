import type { TeacherUsageResponse } from '@arabic/shared';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Td, TableScroll, Th, THead, Tr } from '../components/ui/Table';
import { useUsage } from '../features/teacher/queries';
import { useT } from '../i18n';
import { formatDay, formatNumber, formatUsd } from '../lib/format';

export default function TeacherUsagePage() {
  const { t } = useT();
  const query = useUsage();
  return (
    <Container className="py-8 sm:py-12">
      <Seo title={t('page.teacherUsage')} noindex />
      <h1 className="text-3xl">{t('page.teacherUsage')}</h1>
      <p className="mt-2 text-muted">{t('usage.lead')}</p>
      <LoadState query={query}>{(data) => <UsageView data={data} />}</LoadState>
    </Container>
  );
}

function UsageView({ data }: { data: TeacherUsageResponse }) {
  const { t, tn } = useT();
  const { today, byPurpose, byModel, days } = data;
  const sum = (pick: (d: (typeof byPurpose)[number]) => number) =>
    byPurpose.reduce((total, row) => total + pick(row), 0);

  return (
    <div className="mt-8 space-y-10">
      <section aria-labelledby="today-heading">
        <h2 id="today-heading" className="text-xl">
          {t('usage.today')} <span className="text-base text-muted">({formatDay(today.date)})</span>
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          {(
            [
              ['usage.cap.learner', today.caps.learnerTurns],
              ['usage.cap.guest', today.caps.guestTurns],
              ['usage.cap.model', today.caps.callsPerModel],
            ] as const
          ).map(([key, value]) => (
            <Card key={key} className="p-5">
              <dt className="text-sm text-muted">{t(key)}</dt>
              <dd className="mt-1 text-2xl tabular-nums">{formatNumber(value)}</dd>
            </Card>
          ))}
        </dl>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-base">{t('usage.models.today')}</h3>
            {today.models.length === 0 ? (
              <p className="mt-2 text-muted">{t('usage.noCallsToday')}</p>
            ) : (
              <div className="mt-2">
                <TableScroll label={t('usage.models.today')}>
                  <THead>
                    <tr>
                      <Th>{t('usage.col.model')}</Th>
                      <Th className="text-right">{t('usage.col.callsToday')}</Th>
                    </tr>
                  </THead>
                  <tbody>
                    {today.models.map((m) => (
                      <Tr key={m.model}>
                        <Td className="font-mono text-xs">{m.model}</Td>
                        <Td className="text-right tabular-nums">
                          {m.calls} / {today.caps.callsPerModel}
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </TableScroll>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base">{t('usage.people.today')}</h3>
            {today.people.length === 0 ? (
              <p className="mt-2 text-muted">{t('usage.noTurnsToday')}</p>
            ) : (
              <div className="mt-2">
                <TableScroll label={t('usage.people.today')}>
                  <THead>
                    <tr>
                      <Th>{t('teacher.col.name')}</Th>
                      <Th className="text-right">{t('usage.col.turnsToday')}</Th>
                    </tr>
                  </THead>
                  <tbody>
                    {today.people.map((p) => (
                      <Tr key={p.userId}>
                        <Td>
                          {p.displayName}{' '}
                          {p.isGuest && <Badge tone="neutral">{t('usage.guest')}</Badge>}
                        </Td>
                        <Td className="text-right tabular-nums">
                          {p.turns} / {p.isGuest ? today.caps.guestTurns : today.caps.learnerTurns}
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </TableScroll>
              </div>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="purpose-heading">
        <h2 id="purpose-heading" className="text-xl">
          {t('usage.last30')}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {t('usage.totals', {
            calls: formatNumber(sum((r) => r.calls)),
            cost: formatUsd(sum((r) => r.costMicroUsd)),
          })}
        </p>
        {byPurpose.length === 0 ? (
          <p className="mt-4 text-muted">{t('usage.noCalls')}</p>
        ) : (
          <div className="mt-4 space-y-6">
            <TableScroll label={t('usage.byPurpose')}>
              <THead>
                <tr>
                  <Th>{t('usage.col.purpose')}</Th>
                  <Th className="text-right">{t('usage.col.calls')}</Th>
                  <Th className="text-right">{t('usage.col.in')}</Th>
                  <Th className="text-right">{t('usage.col.out')}</Th>
                  <Th className="text-right">{t('usage.col.cost')}</Th>
                </tr>
              </THead>
              <tbody>
                {byPurpose.map((r) => (
                  <Tr key={r.purpose}>
                    <Td>{r.purpose}</Td>
                    <Td className="text-right tabular-nums">{formatNumber(r.calls)}</Td>
                    <Td className="text-right tabular-nums">{formatNumber(r.inputTokens)}</Td>
                    <Td className="text-right tabular-nums">{formatNumber(r.outputTokens)}</Td>
                    <Td className="text-right tabular-nums">{formatUsd(r.costMicroUsd)}</Td>
                  </Tr>
                ))}
              </tbody>
            </TableScroll>
            <TableScroll label={t('usage.byModel')}>
              <THead>
                <tr>
                  <Th>{t('usage.col.model')}</Th>
                  <Th className="text-right">{t('usage.col.calls')}</Th>
                  <Th className="text-right">{t('usage.col.in')}</Th>
                  <Th className="text-right">{t('usage.col.out')}</Th>
                  <Th className="text-right">{t('usage.col.cost')}</Th>
                </tr>
              </THead>
              <tbody>
                {byModel.map((r) => (
                  <Tr key={r.model}>
                    <Td className="font-mono text-xs">{r.model}</Td>
                    <Td className="text-right tabular-nums">{formatNumber(r.calls)}</Td>
                    <Td className="text-right tabular-nums">{formatNumber(r.inputTokens)}</Td>
                    <Td className="text-right tabular-nums">{formatNumber(r.outputTokens)}</Td>
                    <Td className="text-right tabular-nums">{formatUsd(r.costMicroUsd)}</Td>
                  </Tr>
                ))}
              </tbody>
            </TableScroll>
          </div>
        )}
        <details className="mt-6">
          <summary className="min-h-11 cursor-pointer py-2 text-primary underline underline-offset-4">
            {tn('usage.days', days.filter((d) => d.calls > 0 || d.limited > 0).length)}
          </summary>
          <div className="mt-2">
            <TableScroll label={t('usage.daily')}>
              <THead>
                <tr>
                  <Th>{t('usage.col.day')}</Th>
                  <Th className="text-right">{t('usage.col.calls')}</Th>
                  <Th className="text-right">{t('usage.col.limited')}</Th>
                  <Th className="text-right">{t('usage.col.cost')}</Th>
                </tr>
              </THead>
              <tbody>
                {[...days].reverse().map((d) => (
                  <Tr key={d.date}>
                    <Td>{formatDay(d.date)}</Td>
                    <Td className="text-right tabular-nums">{d.calls}</Td>
                    <Td className="text-right tabular-nums">{d.limited}</Td>
                    <Td className="text-right tabular-nums">{formatUsd(d.costMicroUsd)}</Td>
                  </Tr>
                ))}
              </tbody>
            </TableScroll>
          </div>
        </details>
      </section>
    </div>
  );
}
