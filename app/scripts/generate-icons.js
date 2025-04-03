const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    // Garantir que o diretório existe
    await fs.mkdir(outputDir, { recursive: true });

    // Gerar ícones para cada tamanho
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      await sharp(inputFile)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`✓ Gerado: icon-${size}x${size}.png`);
    }

    console.log('\nTodos os ícones foram gerados com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar ícones:', error);
    process.exit(1);
  }
}

generateIcons(); 