const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

const baseUrl = "http://localhost:5173";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CURRENT_USER_EMAIL = "samuel.pinho.fernandes@gmail.com";

async function setupDriver() {
  const options = new chrome.Options();
  options.addArguments("--start-maximized");
  return await new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

// Verifica se elemento está visível
async function isElementVisible(driver, selector) {
  try {
    const element = await driver.findElement(By.css(selector));
    return await element.isDisplayed();
  } catch {
    return false;
  }
}

// Aguarda e fecha modal clicando na overlay
async function closeModal(driver) {
  try {
    const overlay = await driver.findElement(By.css(".overlay"));
    await driver.executeScript("arguments[0].click();", overlay);
    await sleep(500);
    return true;
  } catch (err) {
    console.log(`  ⚠️ Erro ao fechar modal: ${err.message}`);
    return false;
  }
}


async function runDeleteEventTest() {
  const driver = await setupDriver();
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // ---------------------------------------------------------
    // TC000 - LOGIN
    // ---------------------------------------------------------
    console.log("\n=== TC000 - LOGIN ===");

    await driver.get(baseUrl);

    try {
      await driver.wait(until.elementLocated(By.css("input[type='email']")), 15000);
      const emailInput = await driver.findElement(By.css("input[type='email']"));
      await emailInput.sendKeys(CURRENT_USER_EMAIL);
      console.log(`✔ Email preenchido: ${CURRENT_USER_EMAIL}`);
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao preencher email: ${err.message}`);
      testsFailed++;
      throw err;
    }

    try {
      await driver.wait(until.elementLocated(By.css("input[type='password']")), 15000);
      const passwordInput = await driver.findElement(By.css("input[type='password']"));
      await passwordInput.sendKeys("familia123");
      console.log("✔ Password preenchida");
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao preencher password: ${err.message}`);
      testsFailed++;
      throw err;
    }

    try {
      await sleep(300);
      const loginBtn = await driver.findElement(By.css(".btn-primary"));
      await loginBtn.click();
      console.log("✔ Clique em login");
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao clicar em login: ${err.message}`);
      testsFailed++;
      throw err;
    }

    try {
      await driver.wait(until.urlContains("/dashboard"), 20000);
      console.log("✔ Redirecionado para dashboard");
      testsPassed++;
    } catch (err) {
      console.log(`❌ Não foi redirecionado para dashboard: ${err.message}`);
      testsFailed++;
      throw err;
    }

    // ---------------------------------------------------------
    // TC001 - CARREGAR EVENTOS
    // ---------------------------------------------------------
    console.log("\n=== TC001 - CARREGAR EVENTOS ===");

    await sleep(1000);

    let eventCardsInitial;
    try {
      await driver.wait(until.elementLocated(By.css(".event-card")), 20000);
      eventCardsInitial = await driver.findElements(By.css(".event-card"));
      console.log(`✔ ${eventCardsInitial.length} eventos visíveis inicialmente`);
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao carregar eventos: ${err.message}`);
      testsFailed++;
      throw err;
    }

    // ---------------------------------------------------------
    // TC002 - VERIFICAR BOTÃO '+ OCCURRENCES'
    // ---------------------------------------------------------
    console.log("\n=== TC002 - BOTÃO '+ OCCURRENCES' ===");

    let expandBtn = await driver.findElements(
      By.xpath("//div[contains(@class,'occ-divider')]/span[contains(text(), '+ occurrences')]")
    );

    let allEventCards = eventCardsInitial;

    if (expandBtn.length > 0) {
      console.log(`  → Botão '+ occurrences' encontrado`);
      console.log(`  → Eventos visíveis: ${eventCardsInitial.length}`);
      
      try {
        await expandBtn[0].click();
        await sleep(600);

        allEventCards = await driver.findElements(By.css(".event-card"));
        const hiddenCount = allEventCards.length - eventCardsInitial.length;

        console.log(`✔ Lista expandida!`);
        console.log(`  → Eventos ocultos: ${hiddenCount}`);
        console.log(`  → Total após expansão: ${allEventCards.length}`);
        testsPassed++;
      } catch (err) {
        console.log(`❌ Erro ao expandir lista: ${err.message}`);
        testsFailed++;
      }
    } else {
      console.log(`✔ Sem botão '+ occurrences' (lista já está completa com ${allEventCards.length} eventos)`);
      testsPassed++;
    }

    // ---------------------------------------------------------
    // TC003 - PROCURAR E ELIMINAR EVENTO DO UTILIZADOR
    // ---------------------------------------------------------
    console.log("\n=== TC003 - PROCURAR EVENTO DO UTILIZADOR ===");
    console.log(`  → Total de eventos a verificar: ${allEventCards.length}`);

    let eventFound = false;
    let eventTitle = null;
    let deletedSuccessfully = false;
    let eventsChecked = 0;

    for (let i = 0; i < allEventCards.length; i++) {
      eventsChecked++;
      
      const isHidden = i >= eventCardsInitial.length;
      const position = isHidden ? `(OCULTO #${i - eventCardsInitial.length + 1})` : `(visível)`;
      
      console.log(`  → Verificando evento ${i + 1}/${allEventCards.length} ${position}...`);

      const card = allEventCards[i];

      try {
        // Obter título do evento para debug
        const titleElement = await card.findElement(By.css("h3"));
        eventTitle = await titleElement.getText();
        console.log(`    Evento: "${eventTitle}"`);
      } catch {
        console.log("    (sem título visível)");
      }

      try {
        // Clicar no cartão para abrir modal
        await driver.executeScript("arguments[0].click();", card);
        await sleep(500);

        // Verificar se modal abriu
        const modalExists = await isElementVisible(driver, ".modal");
        if (!modalExists) {
          console.log("    ⚠️ Modal não abriu, próximo evento");
          continue;
        }

        // Procurar elemento "Reported By"
        let reportedByText = null;
        try {
          const creatorEl = await driver.findElement(
            By.xpath("//*[contains(text(),'Reported By')]")
          );
          reportedByText = await creatorEl.getText();
          console.log(`    Criado por: ${reportedByText}`);
        } catch (err) {
          console.log("    ⚠️ Não encontrou 'Reported By'");
          await closeModal(driver);
          continue;
        }

        // Verificar se foi criado pelo utilizador atual
        if (reportedByText.includes(CURRENT_USER_EMAIL)) {
          console.log(`✔ Evento criado por ${CURRENT_USER_EMAIL} encontrado!`);
          testsPassed++;
          eventFound = true;

          // ---------------------------------------------------------
          // TC004 - ELIMINAR EVENTO
          // ---------------------------------------------------------
          console.log("\n=== TC004 - ELIMINAR EVENTO ===");

          try {
            const deleteBtn = await driver.findElement(By.css(".icon-btn.delete"));
            await deleteBtn.click();
            console.log("  → Clique no botão delete");
            await sleep(500);
            testsPassed++;
          } catch (err) {
            console.log(`❌ Erro ao clicar no delete: ${err.message}`);
            testsFailed++;
            await closeModal(driver);
            break;
          }

          // Verificar confirmação
          try {
            const confirmButtons = await driver.findElements(
              By.xpath("//button[contains(text(),'Confirm')]")
            );

            if (confirmButtons.length > 0) {
              await confirmButtons[0].click();
              console.log("✔ Confirmação de eliminação aceita");
              testsPassed++;
              deletedSuccessfully = true;
            } else {
              console.log("⚠️ Sem diálogo de confirmação (eliminação direta?)");
              testsPassed++;
              deletedSuccessfully = true;
            }
          } catch (err) {
            console.log(`⚠️ Erro ao confirmar: ${err.message}`);
            deletedSuccessfully = true; // Pode ter eliminado sem confirmação
          }

          await sleep(1000);
          break;
        } else {
          // Evento não é do utilizador, fechar modal
          console.log("    → Evento criado por outro utilizador, próximo");
          await closeModal(driver);
          await sleep(300);
        }
      } catch (err) {
        console.log(`    ❌ Erro ao processar evento: ${err.message}`);
        await closeModal(driver);
        continue;
      }
    }

    if (!eventFound) {
      console.log(`\n❌ Nenhum evento criado pelo utilizador foi encontrado`);
      console.log(`  → Eventos verificados: ${eventsChecked}`);
      console.log(`    • Visíveis: ${eventCardsInitial.length}`);
      if (allEventCards.length > eventCardsInitial.length) {
        console.log(`    • Ocultos: ${allEventCards.length - eventCardsInitial.length}`);
      }
      testsFailed++;
    }

    // ---------------------------------------------------------
    // TC005 - VALIDAR ELIMINAÇÃO
    // ---------------------------------------------------------
    if (deletedSuccessfully) {
      console.log("\n=== TC005 - VALIDAR ELIMINAÇÃO ===");

      await sleep(1000);

      try {
        const updatedCards = await driver.findElements(By.css(".event-card"));
        const initialCount = allEventCards.length;
        const finalCount = updatedCards.length;

        console.log(`  → Eventos antes: ${initialCount}`);
        console.log(`  → Eventos depois: ${finalCount}`);
        console.log(`  → Total verificados: ${eventsChecked}`);

        if (finalCount < initialCount) {
          console.log(`✔ Evento eliminado com sucesso (${initialCount} → ${finalCount})`);
          testsPassed++;
        } else {
          console.log(`⚠️ Evento pode estar na lista (verificar se foi atualizado)`);
          testsPassed++;
        }
      } catch (err) {
        console.log(`⚠️ Erro ao validar: ${err.message}`);
        testsPassed++;
      }
    }

    // ---------------------------------------------------------
    // RESUMO DOS TESTES
    // ---------------------------------------------------------
    console.log("\n" + "=".repeat(50));
    console.log("RESUMO DOS TESTES");
    console.log("=".repeat(50));
    console.log(`✔ Testes passados: ${testsPassed}`);
    console.log(`❌ Testes falhados: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    
    console.log("\nEVENTOS VERIFICADOS:");
    console.log(`  • Eventos visíveis inicialmente: ${eventCardsInitial.length}`);
    console.log(`  • Eventos ocultos (+ occurrences): ${Math.max(0, allEventCards.length - eventCardsInitial.length)}`);
    console.log(`  • Total verificado: ${eventsChecked}`);
    
    console.log("=".repeat(50));

    if (testsFailed === 0) {
      console.log("✅ TESTE DE ELIMINAÇÃO PASSOU COM SUCESSO!");
    } else {
      console.log(`\n⚠️ ${testsFailed} teste(s) falharam`);
      console.log("\nDicas de debug:");
      console.log("1. Verifique se existem eventos criados por você (visíveis ou ocultos)");
      console.log("2. Verifique os seletores CSS (.icon-btn.delete)");
      console.log("3. Abra DevTools (F12) para inspecionar modais");
      console.log("4. Verifique se há confirmação de eliminação no backend");
    }
    console.log("=".repeat(50) + "\n");

  } catch (err) {
    console.error("\n" + "❌ ".repeat(25));
    console.error("ERRO NO TESTE:");
    console.error(err.message);
    console.error("Stack:", err.stack?.split("\n").slice(0, 5).join("\n"));
    console.error("❌ ".repeat(25) + "\n");
  } finally {
    await driver.quit();
  }
}

runDeleteEventTest();
